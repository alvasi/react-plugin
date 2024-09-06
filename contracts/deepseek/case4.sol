// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MusicStreamingRoyalties is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, ERC721Pausable, ERC721Royalty, Ownable2Step {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    IERC20 public paymentToken;
    mapping(uint256 => uint256) public totalStreamDuration;
    mapping(uint256 => uint256) public totalRoyaltiesPaid;

    struct RoyaltyDistribution {
        address artist;
        address label;
        address platform;
    }

    mapping(uint256 => RoyaltyDistribution) public royaltyDistribution;

    event RoyaltyPaid(uint256 indexed trackId, address indexed artist, address indexed label, address platform, uint256 artistAmount, uint256 labelAmount, uint256 platformAmount);

    constructor(address initialOwner, address _paymentToken) ERC721("MusicTrack", "MUS") Ownable2Step(initialOwner) {
        paymentToken = IERC20(_paymentToken);
    }

    function safeMint(address to, string memory uri, address artist, address label, address platform) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        royaltyDistribution[tokenId] = RoyaltyDistribution(artist, label, platform);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, ERC721Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function updateStreamDuration(uint256 trackId, uint256 duration) external onlyOwner {
        require(super._exists(trackId), "Track does not exist");
        totalStreamDuration[trackId] += duration;
    }

    function distributeRoyalties(uint256 trackId, uint256 amount) external onlyOwner {
        require(_exists(trackId), "Track does not exist");
        RoyaltyDistribution memory distribution = royaltyDistribution[trackId];

        uint256 artistAmount = (amount * 60) / 100;
        uint256 labelAmount = (amount * 30) / 100;
        uint256 platformAmount = (amount * 10) / 100;

        require(paymentToken.transfer(distribution.artist, artistAmount), "Artist transfer failed");
        require(paymentToken.transfer(distribution.label, labelAmount), "Label transfer failed");
        require(paymentToken.transfer(distribution.platform, platformAmount), "Platform transfer failed");

        totalRoyaltiesPaid[trackId] += amount;
        emit RoyaltyPaid(trackId, distribution.artist, distribution.label, distribution.platform, artistAmount, labelAmount, platformAmount);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }
}