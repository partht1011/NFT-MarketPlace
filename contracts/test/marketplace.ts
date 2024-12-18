import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { NFTMarketplace, SnowNFT } from "typechain-types";

const dragonNFTUrl = "https://gateway.pinata.cloud/ipfs/QmR1u8vXJLzBiJTLcr5Y5w6WoMwuEL7AiveZV4dE8TTsXX";
const minionNFTUrl = "https://gateway.pinata.cloud/ipfs/QmNm8BZFQiFMKpUzQFZhXPCc4tCFrnnSerhfkMgbJrX6dH";
const musicNFTUrl = "https://gateway.pinata.cloud/ipfs/QmU2zBdUgZM5ZEumLsC483Fu1hfkqpuf2LzcPWTUfGgbyJ";
describe("NFTMarketplace", function () {
    let nftMarketplace: NFTMarketplace;
    let owner: any;
    let seller: any;
    let buyer: any;
    let nftContract: SnowNFT;
    let tokenId: number;
    let price: bigint;
    let order: any;
    let signature: string;

    beforeEach(async () => {
        // Deploy the NFTMarketplace contract
        const NFTMarketplaceFactory = await ethers.getContractFactory("NFTMarketplace");
        nftMarketplace = await NFTMarketplaceFactory.deploy();

        // Deploy NFT contract to NFTMarketplace
        const NFTFactory = await ethers.getContractFactory("SnowNFT");
        nftContract = await NFTFactory.deploy(await nftMarketplace.getAddress());

        // Get accounts
        [owner, seller, buyer] = await ethers.getSigners();

        // Mint an NFT for the seller
        tokenId = 1;
        await nftContract.mint(dragonNFTUrl);

        // Set price
        price = ethers.parseEther("1");

        // Create an order
        order = {
            seller: seller.address,
            nftContract: await nftContract.getAddress(),
            tokenId,
            price,
            expiry: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
        };

        // Sign the order
        const domainSeparator = await nftMarketplace.DOMAIN_SEPARATOR();
        const orderHash = await nftMarketplace.hashOrder(order);
        const message = ethers.solidityPackedKeccak256(
            ["string", "bytes32", "bytes32"],
            ["\x19\x01", domainSeparator, orderHash]
        );
        signature = await seller.signMessage(ethers.toBeArray(message));
    });

    describe("buy", function () {
        it("should successfully purchase an NFT", async function () {
            // Buyer calls the buy function
            const tx = await nftMarketplace.connect(buyer).buy(order, signature, {
                value: order.price
            });

            // Wait for transaction to be mined
            await tx.wait();

            // Check that the NFT was transferred to the buyer
            const ownerOfNFT = await nftContract.ownerOf(tokenId);
            expect(ownerOfNFT).to.equal(buyer.address);

            // Check that the seller received the payment
            const sellerBalance = await ethers.provider.getBalance(seller.address);
            expect(sellerBalance).to.be.closeTo(price, ethers.parseEther("0.01"));
        });

        it("should fail if the order has expired", async function () {
            // Set expiry to a past time
            order.expiry = Math.floor(Date.now() / 1000) - 3600;

            // Attempt to buy the NFT (should fail)
            await expect(
                nftMarketplace.connect(buyer).buy(order, signature, {
                    value: order.price
                })
            ).to.be.revertedWith("Order has expired");
        });

        it("should fail if the price is incorrect", async function () {
            // Buyer sends incorrect payment
            const incorrectPrice = ethers.parseEther("2");

            // Attempt to buy the NFT (should fail)
            await expect(
                nftMarketplace.connect(buyer).buy(order, signature, {
                    value: incorrectPrice
                })
            ).to.be.revertedWith("Incorrect payment amount");
        });

        it("should fail if the signature is invalid", async function () {
            // Modify the order to make the signature invalid
            order.price = ethers.parseEther("2");

            // Attempt to buy the NFT with an invalid signature (should fail)
            await expect(
                nftMarketplace.connect(buyer).buy(order, signature, {
                    value: order.price
                })
            ).to.be.revertedWith("Invalid signature");
        });
    });

    describe("verifySignature", function () {
        it("should verify a valid signature", async function () {
            const isValid = await nftMarketplace.verifySignature(order, signature);
            expect(isValid).to.be.true;
        });

        it("should fail to verify an invalid signature", async function () {
            const invalidSignature = "0x" + "00".repeat(65); // Invalid signature
            const isValid = await nftMarketplace.verifySignature(order, invalidSignature);
            expect(isValid).to.be.false;
        });
    });
});
