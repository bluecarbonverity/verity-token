// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VerityNFT is ERC721("VerityNFT", "VERY"), Ownable {

  uint256 counter;
  string public baseURI;
  mapping (uint256 => string[]) public tokenIdToFileArray;

  /**
   * @dev Initialize the contract + print 4 NFTs
   */
  constructor() {
    for (uint8 i = 1; i < 5; i++) {
      mint(msg.sender);
    }
  }

  /**
   * @dev Override for baseURI to allow us to set it
   */
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  /**
   * @dev Owner of the contract can change the baseURI once 
   * projects folder is uploaded to IPFS
   */
  function setBaseURI(string memory _baseURIParam) public onlyOwner {
    baseURI = _baseURIParam;
  }

  /**
   * @dev Minting function. Intially private, but could be made public
   * once we allow creating new projects
   */
  function mint(address to) internal returns (uint256) {
    counter++;
    _safeMint(to, counter);
    return counter;
  }

  /**
   * @dev Adds an IPFS link to the array of files maintained in 
   * tokenIdToFileArray mapping
   */
  function addFileToToken(uint256 tokenId, string memory fileURI) public {
    tokenIdToFileArray[tokenId].push(fileURI);
  }

  /**
   * @dev Retrieves array of file links for a given token
   */
  function getTokenFiles(uint256 tokenId) public view returns (string[] memory) {
    return tokenIdToFileArray[tokenId];
  }

  /**
   * @dev Only whilst in test/demo mode. Allows owner of contract 
   * to manually overwrite which files the contract points to.
   */
  function devOverwriteTokenFiles(uint256 tokenId, string[] memory files) public onlyOwner {
    tokenIdToFileArray[tokenId] = files;
  }
}