// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract VerityNFTTest is Initializable, ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
  uint256 counter;
  string public baseURI;
  mapping (uint256 => string[]) public tokenIdToFileArray;

  event BaseURIChanged (string _uri);

  /**
   * @dev Required functionality for upgradable smart contracts.
   * Normal initialization code will go inside initialize() instead.
   */
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @dev Initialize the contract + print 4 NFTs
   */
  function initialize() initializer public {
    __ERC721_init("VerityNFT", "VERY");
    __Ownable_init();
    __UUPSUpgradeable_init();    
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
    emit BaseURIChanged(baseURI);
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
   * @dev Dummy method for testing
   */
  function add(uint256 num1, uint256 num2) public pure returns (uint256) {
    return num1 + num2;
  }

  /**
   * @dev Required functionality for upgradable smart contracts.
   */
  function _authorizeUpgrade(address newImplementation)
    internal
    onlyOwner
    override
  {}
}