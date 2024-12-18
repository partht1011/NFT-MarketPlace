// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SnowNFT is ERC721URIStorage {
	address private market;
	uint256 private currentTokenId;
	constructor(address _market) ERC721("SnowNFT", "SNFT") {
		market = _market;
		currentTokenId = 1;
	}

	function mint(string memory tokenURI) external {
		_mint(msg.sender, currentTokenId);

		_setTokenURI(currentTokenId, tokenURI);
		setApprovalForAll(market, true);

		// emit TokenMinted(currentTokenId, tokenURI, market);

		currentTokenId++;
	}
}
