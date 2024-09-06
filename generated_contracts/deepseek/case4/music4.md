**system**: You are a useful coder that codes secure solidity smart contracts based on user's prompt. Only generate contracts in compliance with legal and ethical standards, excluding any military, surveillance, or unlawful applications. Implement appropriate standards such as ERC20 (fungible), ERC721 (non-fungible), ERC1155 (mix of fungible & non-fungible), and ERC2981 (NFT royalty) if applicable. Use strictly Solidity Pragma version (0.8.27). Ensure minting functions includes proper access control mechanisms. Avoid vulnerabilities such as reentrancy with check-effects-interaction and avoid low level calls. Validate arguments with require or assert statements. Minimise gas costs by caching and avoiding for loops over dynamic arrays. Minimise number of critical functions accessible to owners (try not to use Ownable or Ownable2Step). Use Roles.sol if role-based access control is required. Implement as much as possible but be concise. Ask user if further clarification for functionality is needed and provide suggestions based on context.

**user**: I want to automate music streaming royalty calculations and distributions. The contract should handle payments based on streaming duration.

**assistant**: To automate music streaming royalty calculations and distributions, we can create a smart contract that handles the following:

1. **Track Ownership and Royalties**: Each track will be represented as an ERC721 (non-fungible token) to manage ownership.
2. **Streaming Payments**: The contract will calculate payments based on streaming duration.
3. **Royalty Distribution**: The contract will distribute royalties to the track owners based on the streaming data.

Given the complexity of handling real-time streaming data on-chain, we'll assume that streaming data (duration and track ID) is submitted off-chain and then processed by the contract.

### Suggestions:

1. **Off-Chain Data Submission**: Use a trusted oracle or a decentralized oracle network (DON) to submit streaming data securely.
2. **Payment Token**: Use an ERC20 token for payments.
3. **Royalty Calculation**: Implement a simple royalty calculation based on streaming duration.

### Contract Implementation:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MusicStreamingRoyalties is ERC721, AccessControl, ReentrancyGuard {
    bytes32 public constant STREAM_MANAGER_ROLE = keccak256("STREAM_MANAGER_ROLE");
    IERC20 public paymentToken;
    uint256 public royaltyRate; // Royalty rate per second in token units

    struct Track {
        address owner;
        uint256 totalStreamedSeconds;
    }

    mapping(uint256 => Track) public tracks;

    event StreamDataSubmitted(uint256 indexed trackId, uint256 duration);
    event RoyaltiesDistributed(uint256 indexed trackId, address indexed owner, uint256 amount);

    constructor(address _paymentToken, uint256 _royaltyRate) ERC721("MusicTrack", "MUS") {
        paymentToken = IERC20(_paymentToken);
        royaltyRate = _royaltyRate;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintTrack(address to, uint256 trackId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _safeMint(to, trackId);
        tracks[trackId] = Track({
            owner: to,
            totalStreamedSeconds: 0
        });
    }

    function submitStreamData(uint256 trackId, uint256 duration) external onlyRole(STREAM_MANAGER_ROLE) {
        require(_exists(trackId), "Track does not exist");
        tracks[trackId].totalStreamedSeconds += duration;
        emit StreamDataSubmitted(trackId, duration);
    }

    function distributeRoyalties(uint256 trackId) external nonReentrant {
        require(_exists(trackId), "Track does not exist");
        Track storage track = tracks[trackId];
        uint256 totalRoyalties = track.totalStreamedSeconds * royaltyRate;
        require(paymentToken.transfer(track.owner, totalRoyalties), "Transfer failed");
        track.totalStreamedSeconds = 0; // Reset after distribution
        emit RoyaltiesDistributed(trackId, track.owner, totalRoyalties);
    }

    function setRoyaltyRate(uint256 _royaltyRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        royaltyRate = _royaltyRate;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```

### Explanation:

1. **ERC721**: Each music track is represented as an NFT.
2. **AccessControl**: Role-based access control for minting tracks and submitting streaming data.
3. **ReentrancyGuard**: Prevents reentrancy attacks during royalty distribution.
4. **submitStreamData**: Allows a trusted role to submit streaming data.
5. **distributeRoyalties**: Distributes royalties to the track owner based on the total streamed seconds.
6. **setRoyaltyRate**: Allows the admin to set the royalty rate per second.

### Questions:

1. **Payment Token**: Do you have a specific ERC20 token in mind for payments?
2. **Royalty Rate**: How do you want to set the initial royalty rate?
3. **Stream Data Submission**: How will the streaming data be submitted to the contract? (e.g., via an oracle)

Would you like to make any adjustments or provide more details?
Stream Response Time: 64577.681884765625 ms

{
"prompt_tokens": 276,
"completion_tokens": 1140,
"total_tokens": 1416,
"prompt_cache_hit_tokens": 192,
"prompt_cache_miss_tokens": 84
}

**user**: To incorporate the distribution of royalties as specified (60% to the artist, 30% to the recording label, and 10% as a platform fee) and use the ERC2981 standard for NFT royalties, we can extend the previous contract.

**assistant**: To incorporate the distribution of royalties as specified (60% to the artist, 30% to the recording label, and 10% as a platform fee) and use the ERC2981 standard for NFT royalties, we can extend the previous contract.

### Contract Implementation:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

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
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintTrack(address artist, address label, uint256 trackId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _safeMint(artist, trackId);
        tracks[trackId] = Track({
            artist: artist,
            label: label,
            totalStreamedSeconds: 0
        });
    }

    function submitStreamData(uint256 trackId, uint256 duration) external onlyRole(STREAM_MANAGER_ROLE) {
        require(_exists(trackId), "Track does not exist");
        tracks[trackId].totalStreamedSeconds += duration;
        emit StreamDataSubmitted(trackId, duration);
    }

    function distributeRoyalties(uint256 trackId) external nonReentrant {
        require(_exists(trackId), "Track does not exist");
        Track storage track = tracks[trackId];
        uint256 totalRoyalties = track.totalStreamedSeconds * royaltyRate;
        uint256 artistAmount = (totalRoyalties * 60) / 100;
        uint256 labelAmount = (totalRoyalties * 30) / 100;
        uint256 platformAmount = totalRoyalties - artistAmount - labelAmount;

        require(paymentToken.transfer(track.artist, artistAmount), "Artist transfer failed");
        require(paymentToken.transfer(track.label, labelAmount), "Label transfer failed");
        require(paymentToken.transfer(platformFeeReceiver, platformAmount), "Platform transfer failed");

        track.totalStreamedSeconds = 0; // Reset after distribution
        emit RoyaltiesDistributed(trackId, track.artist, track.label, artistAmount, labelAmount, platformAmount);
    }

    function setRoyaltyRate(uint256 _royaltyRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        royaltyRate = _royaltyRate;
    }

    function setPlatformFeeReceiver(address _platformFeeReceiver) external onlyRole(DEFAULT_ADMIN_ROLE) {
        platformFeeReceiver = _platformFeeReceiver;
    }

    // ERC2981 Implementation
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view override returns (address, uint256) {
        require(_exists(_tokenId), "Token does not exist");
        Track storage track = tracks[_tokenId];
        uint256 royaltyAmount = (_salePrice * 10) / 100; // 10% royalty
        return (track.artist, royaltyAmount);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}
```

### Explanation:

1. **ERC721**: Each music track is represented as an NFT.
2. **AccessControl**: Role-based access control for minting tracks and submitting streaming data.
3. **ReentrancyGuard**: Prevents reentrancy attacks during royalty distribution.
4. **submitStreamData**: Allows a trusted role to submit streaming data.
5. **distributeRoyalties**: Distributes royalties to the artist, label, and platform fee receiver based on the total streamed seconds.
6. **setRoyaltyRate**: Allows the admin to set the royalty rate per second.
7. **setPlatformFeeReceiver**: Allows the admin to set the platform fee receiver address.
8. **ERC2981 Implementation**: Implements the `royaltyInfo` function to provide royalty information for secondary market sales.

### Questions:

1. **Payment Token**: Do you have a specific ERC20 token in mind for payments?
2. **Royalty Rate**: How do you want to set the initial royalty rate?
3. **Stream Data Submission**: How will the streaming data be submitted to the contract? (e.g., via an oracle)
4. **Platform Fee Receiver**: Who should receive the platform fee?

Would you like to make any adjustments or provide more details?
Stream Response Time: 87350.38696289062 ms
{
"prompt_tokens": 1465,
"completion_tokens": 1436,
"total_tokens": 2901,
"prompt_cache_hit_tokens": 1408,
"prompt_cache_miss_tokens": 57
}
