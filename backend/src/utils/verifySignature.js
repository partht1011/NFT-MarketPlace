const { ethers } = require("ethers");

const domain = {
    name: "NFT Marketplace",
    version: "1",
    chainId: 1, // Replace with your chain ID
    verifyingContract: "0xYourMarketplaceContractAddress",
};

const types = {
    Order: [
        { name: "seller", type: "address" },
        { name: "nftContract", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "price", type: "uint256" },
        { name: "expiry", type: "uint256" },
    ],
};

const verifySignature = (order, signature) => {
    const signer = ethers.utils.verifyTypedData(domain, types, order, signature);
    return signer;
};

module.exports = { verifySignature };
