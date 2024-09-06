// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MaterialSupplyChain is Ownable2Step {
    using Counters for Counters.Counter;
    Counters.Counter private _transactionIdCounter;

    struct Transaction {
        string materialType;
        uint256 quantity;
        uint256 cost;
        string originCountry;
        string originFarm;
        bool certified;
        uint256 deliveryDuration;
        string deliveryMode;
    }

    mapping(uint256 => Transaction) public transactions;

    event TransactionAdded(uint256 indexed transactionId, string materialType, uint256 quantity, uint256 cost);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function addTransaction(
        string memory materialType,
        uint256 quantity,
        uint256 cost,
        string memory originCountry,
        string memory originFarm,
        bool certified,
        uint256 deliveryDuration,
        string memory deliveryMode
    ) public onlyOwner {
        require(bytes(materialType).length > 0, "Material type cannot be empty");
        require(quantity > 0, "Quantity must be greater than zero");
        require(cost > 0, "Cost must be greater than zero");
        require(deliveryDuration > 0, "Delivery duration must be greater than zero");
        require(
            keccak256(bytes(deliveryMode)) == keccak256(bytes("air")) ||
            keccak256(bytes(deliveryMode)) == keccak256(bytes("sea")) ||
            keccak256(bytes(deliveryMode)) == keccak256(bytes("land")),
            "Invalid delivery mode"
        );

        uint256 transactionId = _transactionIdCounter.current();
        _transactionIdCounter.increment();

        transactions[transactionId] = Transaction(
            materialType,
            quantity,
            cost,
            originCountry,
            originFarm,
            certified,
            deliveryDuration,
            deliveryMode
        );

        emit TransactionAdded(transactionId, materialType, quantity, cost);
    }

    function getTransaction(uint256 transactionId) public view returns (Transaction memory) {
        require(transactionId < _transactionIdCounter.current(), "Invalid transaction ID");
        return transactions[transactionId];
    }
}