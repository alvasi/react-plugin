// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

contract SupplyChainTracker {
    struct MaterialTransaction {
        bytes32 materialType;
        uint256 quantity;
        uint256 cost;
        bytes32 farmName;
        bytes32 countryOrigin;
        bytes32 certificationStatus;
        uint256 deliveryDuration;
        bytes32 modeOfDelivery;
        address sender;
    }

    mapping(uint256 => MaterialTransaction) public transactions;
    uint256 public transactionCount;
    mapping(address => bool) public authorizedFactories;

    event TransactionRecorded(
        uint256 indexed transactionId,
        bytes32 indexed materialType,
        uint256 quantity,
        uint256 cost,
        bytes32 farmName,
        bytes32 countryOrigin,
        bytes32 certificationStatus,
        uint256 deliveryDuration,
        bytes32 modeOfDelivery,
        address indexed sender
    );

    modifier onlyAuthorized() {
        require(authorizedFactories[msg.sender], "Not authorized");
        _;
    }

    constructor(address[] memory initialFactories) {
        for (uint256 i = 0; i < initialFactories.length; i++) {
            authorizedFactories[initialFactories[i]] = true;
        }
    }

    function addAuthorizedFactory(address factory) external onlyAuthorized {
        authorizedFactories[factory] = true;
    }

    function removeAuthorizedFactory(address factory) external onlyAuthorized {
        authorizedFactories[factory] = false;
    }

    function recordTransaction(
        bytes32 materialType,
        uint256 quantity,
        uint256 cost,
        bytes32 farmName,
        bytes32 countryOrigin,
        bytes32 certificationStatus,
        uint256 deliveryDuration,
        bytes32 modeOfDelivery
    ) external onlyAuthorized {
        require(quantity > 0, "Quantity must be greater than zero");
        require(cost > 0, "Cost must be greater than zero");
        require(deliveryDuration > 0, "Delivery duration must be greater than zero");

        MaterialTransaction memory newTransaction = MaterialTransaction({
            materialType: materialType,
            quantity: quantity,
            cost: cost,
            farmName: farmName,
            countryOrigin: countryOrigin,
            certificationStatus: certificationStatus,
            deliveryDuration: deliveryDuration,
            modeOfDelivery: modeOfDelivery,
            sender: msg.sender
        });

        uint256 transactionId = transactionCount++;
        transactions[transactionId] = newTransaction;

        emit TransactionRecorded(
            transactionId,
            materialType,
            quantity,
            cost,
            farmName,
            countryOrigin,
            certificationStatus,
            deliveryDuration,
            modeOfDelivery,
            msg.sender
        );
    }

    function getTransaction(uint256 transactionId) external view returns (
        bytes32,
        uint256,
        uint256,
        bytes32,
        bytes32,
        bytes32,
        uint256,
        bytes32,
        address
    ) {
        require(transactionId < transactionCount, "Invalid transaction ID");
        MaterialTransaction memory transaction = transactions[transactionId];
        return (
            transaction.materialType,
            transaction.quantity,
            transaction.cost,
            transaction.farmName,
            transaction.countryOrigin,
            transaction.certificationStatus,
            transaction.deliveryDuration,
            transaction.modeOfDelivery,
            transaction.sender
        );
    }
}