// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract MusicStreamingRoyalties is ERC721, AccessControl, ReentrancyGuard, IERC2981 {
    bytes32 public constant STREAM_MANAGER_ROLE = keccak256("STREAM_MANAGER_ROLE");
    IERC20 public paymentToken;
    uint256 public royaltyRate; // Royalty rate per second in token units

    struct Track {
        address artist;
        address label;
        uint256 totalStreamedSeconds;
    }

    mapping(uint256 => Track) public tracks;
    address public platformFeeReceiver;

    event StreamDataSubmitted(uint256 indexed trackId, uint256 duration);
    event RoyaltiesDistributed(uint256 indexed trackId, address indexed artist, address indexed label, uint256 artistAmount, uint256 labelAmount, uint256 platformAmount);

    constructor(address _paymentToken, uint256 _royaltyRate, address _platformFeeReceiver) ERC721("MusicTrack", "MUS") {
        paymentToken = IERC20(_paymentToken);
        royaltyRate = _royaltyRate;
        platformFeeReceiver = _platformFeeReceiver;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintTrack(
        address artist,
        address label,
        uint256 trackId
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Ensure the track does not already exist
        require(_requireOwned(trackId) == address(0), "Track already exists");

        // Initialize the track data
        tracks[trackId] = Track({
            artist: artist,
            label: label,
            totalStreamedSeconds: 0
        });

        // Mint the token after initializing the track data
        _safeMint(artist, trackId);
    }

    function submitStreamData(uint256 trackId, uint256 duration) external onlyRole(STREAM_MANAGER_ROLE) {
        require(_requireOwned(trackId) != address(0), "Track does not exist");
        tracks[trackId].totalStreamedSeconds += duration;
        emit StreamDataSubmitted(trackId, duration);
    }

    function distributeRoyalties(uint256 trackId) external nonReentrant {
        require(_requireOwned(trackId) != address(0), "Track does not exist");
        Track storage track = tracks[trackId];
        uint256 totalRoyalties = track.totalStreamedSeconds * royaltyRate;
        uint256 artistAmount = (totalRoyalties * 60) / 100;
        uint256 labelAmount = (totalRoyalties * 30) / 100;
        uint256 platformAmount = totalRoyalties - artistAmount - labelAmount;

        emit RoyaltiesDistributed(trackId, track.artist, track.label, artistAmount, labelAmount, platformAmount);

        require(paymentToken.transfer(track.artist, artistAmount), "Artist transfer failed");
        require(paymentToken.transfer(track.label, labelAmount), "Label transfer failed");
        require(paymentToken.transfer(platformFeeReceiver, platformAmount), "Platform transfer failed");

        track.totalStreamedSeconds = 0;
    }

    function setRoyaltyRate(uint256 _royaltyRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        royaltyRate = _royaltyRate;
    }

    function setPlatformFeeReceiver(address _platformFeeReceiver) external onlyRole(DEFAULT_ADMIN_ROLE) {
        platformFeeReceiver = _platformFeeReceiver;
    }

    // ERC2981 Implementation
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view override returns (address, uint256) {
        require(_requireOwned(_tokenId) != address(0), "Token does not exist");
        Track storage track = tracks[_tokenId];
        uint256 royaltyAmount = (_salePrice * 10) / 100; // 10%ß royalty
        return (track.artist, royaltyAmount);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}