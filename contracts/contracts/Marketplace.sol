// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
	// EIP-712 Domain and TypeHash constants
	bytes32 public constant DOMAIN_TYPEHASH =
		keccak256(
			"EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
		);
	bytes32 public constant ORDER_TYPEHASH =
		keccak256(
			"Order(address seller,address nftContract,uint256 tokenId,uint256 price,uint256 expiry)"
		);

	bytes32 public DOMAIN_SEPARATOR;

	// Struct to represent an order
	struct Order {
		address seller;
		address nftContract;
		uint256 tokenId;
		uint256 price;
		uint256 expiry;
	}

	event Purchase(
		address indexed buyer,
		address indexed seller,
		address nftContract,
		uint256 tokenId,
		uint256 price
	);

	constructor() {
		DOMAIN_SEPARATOR = keccak256(
			abi.encode(
				DOMAIN_TYPEHASH,
				keccak256("NFT Marketplace"), // Name
				keccak256("1"), // Version
				block.chainid, // Chain ID
				address(this) // Contract address
			)
		);
	}

	/**
	 * @notice Hash the order struct to get the EIP-712 hash.
	 */
	function hashOrder(Order memory order) public pure returns (bytes32) {
		return
			keccak256(
				abi.encode(
					ORDER_TYPEHASH,
					order.seller,
					order.nftContract,
					order.tokenId,
					order.price,
					order.expiry
				)
			);
	}

	/**
	 * @notice Verifies that an order is signed by the seller.
	 */
	function verifySignature(
		Order memory order,
		bytes memory signature
	) public view returns (bool) {
		bytes32 digest = keccak256(
			abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, hashOrder(order))
		);
		return recoverSigner(digest, signature) == order.seller;
	}

	/**
	 * @notice Recover the signer of a signature.
	 */
	function recoverSigner(
		bytes32 digest,
		bytes memory signature
	) public pure returns (address) {
		(uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
		return ecrecover(digest, v, r, s);
	}

	/**
	 * @notice Splits a signature into its `r`, `s`, and `v` components.
	 */
	function splitSignature(
		bytes memory sig
	) public pure returns (uint8 v, bytes32 r, bytes32 s) {
		require(sig.length == 65, "Invalid signature length");

		assembly {
			r := mload(add(sig, 32))
			s := mload(add(sig, 64))
			v := byte(0, mload(add(sig, 96)))
		}

		return (v, r, s);
	}

	/**
	 * @notice Buy an NFT using a signed order.
	 */
	function buy(Order memory order, bytes memory signature) external payable {
		require(block.timestamp <= order.expiry, "Order has expired");
		require(msg.value == order.price, "Incorrect payment amount");

		// Verify the signature
		require(verifySignature(order, signature), "Invalid signature");

		// Transfer the NFT
		IERC721(order.nftContract).safeTransferFrom(
			order.seller,
			msg.sender,
			order.tokenId
		);

		// Transfer the payment to the seller
		payable(order.seller).transfer(msg.value);

		emit Purchase(
			msg.sender,
			order.seller,
			order.nftContract,
			order.tokenId,
			order.price
		);
	}
}
