// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LimitedNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    uint256 public constant MAX_SUPPLY = 100;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {
    tokenCounter = 0;
}



    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        require(tokenCounter < MAX_SUPPLY, "Max NFT limit reached");

        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        tokenCounter += 1;

        return newTokenId;
    }
}
