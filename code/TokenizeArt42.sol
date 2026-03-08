// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenizeArt42
 * @dev NFT contract for the TokenizeArt project
 * @notice This contract implements ERC-721 standard (compatible with BEP-721 on BSC)
 */
contract TokenizeArt42 is ERC721, ERC721URIStorage, Ownable {
    // Token ID counter
    uint256 private _nextTokenId;
    
    // Maximum supply of NFTs
    uint256 public constant MAX_SUPPLY = 42;
    
    // Mint price (0.001 BNB for testnet)
    uint256 public mintPrice = 0.001 ether;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintPriceUpdated(uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);
    
    /**
     * @dev Constructor to initialize the NFT collection
     * @param initialOwner Address of the contract owner
     */
    constructor(address initialOwner) 
        ERC721("TokenizeArt42", "TA42") 
        Ownable(initialOwner) 
    {
        _baseTokenURI = "";
    }
    
    /**
     * @dev Set base URI for all tokens
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }
    
    /**
     * @dev Get base URI
     * @return Base URI string
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Update mint price
     * @param newPrice New price in wei
     */
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }
    
    /**
     * @dev Mint a new NFT
     * @param to Address to mint the NFT to
     * @param uri Metadata URI for the NFT
     */
    function safeMint(address to, string memory uri) public payable {
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit NFTMinted(to, tokenId, uri);
    }
    
    /**
     * @dev Owner can mint for free
     * @param to Address to mint the NFT to
     * @param uri Metadata URI for the NFT
     */
    function ownerMint(address to, string memory uri) public onlyOwner {
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit NFTMinted(to, tokenId, uri);
    }
    
    /**
     * @dev Get total number of minted tokens
     * @return Total minted count
     */
    function totalMinted() public view returns (uint256) {
        return _nextTokenId;
    }
    
    /**
     * @dev Withdraw contract balance to owner
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Override required by Solidity for multiple inheritance
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override required by Solidity for multiple inheritance
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
