// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TournamentRewards is AccessControl, VRFConsumerBase, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIdCounter;

    bytes32 private constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");

    ERC1155 public goldToken;
    ERC1155 public mysteryBoxToken;
    ERC1155 public characterSkinToken;

    uint256 private constant EVENT_EXCLUSIVE_RING = 0;
    uint256 private constant CRYSTAL = 1;

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    mapping(bytes32 => address) public requestIdToPlayer;
    mapping(bytes32 => uint256) public requestIdToAmount;

    event RandomnessRequested(bytes32 requestId);
    event RandomnessFulfilled(uint256 randomness);

    constructor(
        address goldTokenAddress,
        address mysteryBoxTokenAddress,
        address characterSkinTokenAddress,
        address vrfCoordinator,
        address linkToken,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBase(vrfCoordinator, linkToken) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        goldToken = ERC1155(goldTokenAddress);
        mysteryBoxToken = ERC1155(mysteryBoxTokenAddress);
        characterSkinToken = ERC1155(characterSkinTokenAddress);

        keyHash = _keyHash;
        fee = _fee;
    }

    function distributeRewards(address[] calldata players, uint256[] calldata rankings) external onlyRole(MINTER_ROLE) nonReentrant {
        require(players.length == rankings.length, "Mismatched array lengths");

        for (uint256 i = 0; i < players.length; ++i) {
            address player = players[i];
            uint256 rank = rankings[i];

            if (rank == 1) {
                goldToken.safeTransferFrom(address(this), player, 0, 10000, "");
                requestRandomness(player, 5);
                characterSkinToken.safeTransferFrom(address(this), player, _tokenIdCounter.current(), 1, "");
                _tokenIdCounter.increment();
            } else if (rank >= 2 && rank <= 5) {
                goldToken.safeTransferFrom(address(this), player, 0, 5000, "");
                requestRandomness(player, 3);
            } else if (rank >= 6 && rank <= 10) {
                goldToken.safeTransferFrom(address(this), player, 0, 2500, "");
                requestRandomness(player, 1);
            } else {
                goldToken.safeTransferFrom(address(this), player, 0, 100, "");
            }
        }
    }

    function requestRandomness(address player, uint256 amount) internal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        requestId = requestRandomness(keyHash, fee);
        requestIdToPlayer[requestId] = player;
        requestIdToAmount[requestId] = amount;
        emit RandomnessRequested(requestId);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override nonReentrant {
        address player = requestIdToPlayer[requestId];
        uint256 amount = requestIdToAmount[requestId];
        randomResult = randomness;
        distributeMysteryBoxes(player, amount);
        emit RandomnessFulfilled(randomness);
    }

    function distributeMysteryBoxes(address to, uint256 amount) internal {
        uint256 eventExclusiveRingIndex = randomResult % amount;
        for (uint256 i = 0; i < amount; ++i) {
            if (i == eventExclusiveRingIndex) {
                mysteryBoxToken.safeTransferFrom(address(this), to, EVENT_EXCLUSIVE_RING, 1, "");
            } else {
                uint256 crystals = (randomResult.add(i)) % 91 + 10;
                mysteryBoxToken.safeTransferFrom(address(this), to, CRYSTAL, crystals, "");
            }
        }
    }
}

contract GoldToken is ERC1155 {
    constructor() ERC1155("") {}

    function mint(address to, uint256 id, uint256 amount) external {
        _mint(to, id, amount, "");
    }
}

contract MysteryBoxToken is ERC1155 {
    constructor() ERC1155("") {}

    function mint(address to, uint256 id, uint256 amount) external {
        _mint(to, id, amount, "");
    }
}

contract CharacterSkinToken is ERC1155 {
    constructor() ERC1155("") {}

    function mint(address to, uint256 id, uint256 amount) external {
        _mint(to, id, amount, "");
    }
}