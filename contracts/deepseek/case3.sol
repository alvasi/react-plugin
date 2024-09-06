// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract TournamentRewards is Ownable2Step, VRFConsumerBase, ERC1155 {
    ERC1155 public mysteryBox;

    uint256 public constant GOLD_TOKEN_ID = 1;
    uint256 public constant CHARACTER_SKIN_ID = 2;
    uint256 public constant MYSTERY_BOX_ID = 3;

    uint256 public constant GOLD_WINNER = 10000;
    uint256 public constant GOLD_RANK2_5 = 5000;
    uint256 public constant GOLD_RANK6_10 = 2500;
    uint256 public constant GOLD_PARTICIPATION = 100;

    uint256 public constant MYSTERY_BOX_WINNER = 5;
    uint256 public constant MYSTERY_BOX_RANK2_5 = 3;
    uint256 public constant MYSTERY_BOX_RANK6_10 = 1;

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    mapping(bytes32 => address) public requestIdToPlayer;

    constructor(
        address initialOwner,
        address _mysteryBox,
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee,
        string memory uri_
    ) Ownable(initialOwner) VRFConsumerBase(_vrfCoordinator, _linkToken) ERC1155(uri_){
        mysteryBox = ERC1155(_mysteryBox);
        keyHash = _keyHash;
        fee = _fee;
    }

    function distributeRewards(address[] calldata players, uint256[] calldata rankings) external onlyOwner {
        require(players.length == rankings.length, "Mismatched array lengths");

        for (uint256 i = 0; i < players.length; i++) {
            address player = players[i];
            uint256 rank = rankings[i];

            if (rank == 1) {
                _mintToken(player, GOLD_TOKEN_ID, GOLD_WINNER, "");
                mysteryBox.safeTransferFrom(address(this), player, MYSTERY_BOX_ID, MYSTERY_BOX_WINNER, "");
                _mintToken(player, CHARACTER_SKIN_ID, 1, "");
            } else if (rank >= 2 && rank <= 5) {
                _mintToken(player, GOLD_TOKEN_ID, GOLD_RANK2_5, "");
                mysteryBox.safeTransferFrom(address(this), player, MYSTERY_BOX_ID, MYSTERY_BOX_RANK2_5, "");
            } else if (rank >= 6 && rank <= 10) {
                _mintToken(player, GOLD_TOKEN_ID, GOLD_RANK6_10, "");
                mysteryBox.safeTransferFrom(address(this), player, MYSTERY_BOX_ID, MYSTERY_BOX_RANK6_10, "");
            } else {
                _mintToken(player, GOLD_TOKEN_ID, GOLD_PARTICIPATION, "");
            }
        }
    }

    function requestRandomness(address player) external onlyOwner returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        requestId = requestRandomness(keyHash, fee);
        requestIdToPlayer[requestId] = player;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness;
        address player = requestIdToPlayer[requestId];
        uint256 boxCount = MYSTERY_BOX_WINNER; // Assuming the winner gets the most boxes
        uint256 eventExclusiveIndex = randomness % boxCount;

        for (uint256 i = 0; i < boxCount; i++) {
            if (i == eventExclusiveIndex) {
                // Mint event exclusive ring
                mysteryBox.safeTransferFrom(address(this), player, MYSTERY_BOX_ID, 1, "");
            } else {
                // Mint crystals (10 to 100)
                uint256 crystals = 10 + (randomness % 91); // Random number between 10 and 100
                mysteryBox.safeTransferFrom(address(this), player, MYSTERY_BOX_ID, crystals, "");
            }
        }
    }

    function _mintToken(address to, uint256 id, uint256 amount, bytes memory data) internal {
        _mint(to, id, amount, data);
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}