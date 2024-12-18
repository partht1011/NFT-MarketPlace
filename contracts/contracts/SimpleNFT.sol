// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721, Ownable {
	uint256 public nextTokenId; // Variable to keep track of the next token ID
	mapping(uint256 => string) private _tokenURIs; // Mapping from token ID to token URI

	/**
	 * @dev Constructor to initialize the NFT contract.
	 * @param name The name of the NFT collection.
	 * @param symbol The symbol of the NFT collection.
	 */
	constructor(
		string memory name,
		string memory symbol
	) ERC721(name, symbol) Ownable(msg.sender) {
		nextTokenId = 1; // Start token IDs from 1
	}

	/**
	 * @dev Function to mint a new NFT.
	 * @param to The address to which the NFT will be minted.
	 * @param uri The URI for the NFT metadata.
	 */
	function mint(address to, string memory uri) external onlyOwner {
		uint256 tokenId = nextTokenId; // Get the current token ID
		_safeMint(to, tokenId); // Mint the NFT
		_setTokenURI(tokenId, uri); // Set the token URI
		nextTokenId++; // Increment the token ID for the next minting
	}

	/**
	 * @dev Internal function to set the token URI.
	 * @param tokenId The ID of the token.
	 * @param uri The URI for the token metadata.
	 */
	function _setTokenURI(uint256 tokenId, string memory uri) internal {
		_tokenURIs[tokenId] = uri; // Store the token URI
	}

	/**
	 * @dev Function to retrieve the token URI.
	 * @param tokenId The ID of the token.
	 * @return The URI of the token metadata.
	 */
	function tokenURI(
		uint256 tokenId
	) public view override returns (string memory) {
		return _tokenURIs[tokenId]; // Return the token URI
	}
}
