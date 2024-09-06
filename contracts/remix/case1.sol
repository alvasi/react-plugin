// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SupplyChain is ERC721 {
struct Material {
string name;
string material; // "cashmere" or "wool"
uint256 quantity; // in kilograms
uint256 cost; // in GBP
string origin; // country and specific farm
bool certification; // true if certified, false otherwise
uint256 deliveryDuration; // in days
string deliveryMode; // "air", "sea", or "land"
uint256 qualityCheckPercentage; // percentage of material that passed quality check
}

    struct Transaction {
        address from;
        address to;
        Material material;
        uint256 timestamp;
    }

    Material[] public materials;
    Transaction[] public transactions;

    constructor() ERC721("SupplyChain", "SC") {}

    function addMaterial(
        string memory name,
        string memory materialType,
        uint256 quantity,
        uint256 cost,
        string memory origin,
        bool certification,
        uint256 deliveryDuration,
        string memory deliveryMode,
        uint256 qualityCheckPercentage
    ) public {
        materials.push(Material(
            name,
            materialType,
            quantity,
            cost,
            origin,
            certification,
            deliveryDuration,
            deliveryMode,
            qualityCheckPercentage
        ));
    }

    function addTransaction(
        address from,
        address to,
        string memory materialName,
        string memory materialType,
        uint256 quantity,
        uint256 cost,
        string memory origin,
        bool certification,
        uint256 deliveryDuration,
        string memory deliveryMode,
        uint256 qualityCheckPercentage
    ) public {
        uint256 materialIndex;
        for (uint256 i = 0; i < materials.length; i++) {
            if (keccak256(abi.encodePacked(materials[i].name)) == keccak256(abi.encodePacked(materialName))) {
                materialIndex = i;
                break;
            }
        }

        materials[materialIndex].quantity -= quantity;
        transactions.push(Transaction(
            from,
            to,
            Material(
                materialName,
                materialType,
                quantity,
                cost,
                origin,
                certification,
                deliveryDuration,
                deliveryMode,
                qualityCheckPercentage
            ),
            block.timestamp
        ));
    }

    function getMaterials() public view returns (Material[] memory) {
        return materials;
    }

    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

}