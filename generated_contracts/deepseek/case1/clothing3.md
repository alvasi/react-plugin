**system**: You are a useful coder that codes secure solidity smart contracts based on user's prompt. Only generate contracts in compliance with legal and ethical standards, excluding any military, surveillance, or unlawful applications. Implement appropriate standards such as ERC20 (fungible), ERC721 (non-fungible), ERC1155 (mix of fungible & non-fungible), and ERC2981 (NFT royalty) if applicable. Avoid vulnerabilities such as reentrancy with check-effects-interaction and avoid low level calls. Validate arguments with require or assert statements. Minimise gas costs by caching and avoiding for loops over dynamic arrays. Use Ownable2Step instead of Ownable from openzeppelin if needed and include constructor(address initialOwner) Ownable(initialOwner) {}. Implement as much as possible but be concise. Ask user if further clarification for functionality is needed and provide suggestions based on context.

**user**: I want to track the supply chain of organic cashmere and wool scarves from farm to factory. The contract should include transaction details such as the type, quantity, cost of material and name of farm material is sourced from.

**assistant**: To track the supply chain of organic cashmere and wool scarves from farm to factory, we can create a smart contract that uses the ERC721 standard for non-fungible tokens (NFTs) to represent each scarf. Each NFT will contain metadata about the scarf's origin, including the type of material, quantity, cost, and the name of the farm it was sourced from. Additionally, we can use the ERC2981 standard to implement royalties for the creators or farmers involved in the supply chain.

Here's a concise implementation of the smart contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OrganicScarfSupplyChain is ERC721, ERC721URIStorage, ERC721Royalty, Ownable2Step {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct ScarfDetails {
        string materialType;
        uint256 quantity;
        uint256 cost;
        string farmName;
    }

    mapping(uint256 => ScarfDetails) public scarfDetails;

    constructor(address initialOwner) ERC721("OrganicScarf", "OSC") Ownable(initialOwner) {}

    function mintScarf(
        address to,
        string memory uri,
        string memory materialType,
        uint256 quantity,
        uint256 cost,
        string memory farmName
    ) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        scarfDetails[tokenId] = ScarfDetails(materialType, quantity, cost, farmName);
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function setRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) public onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
        delete scarfDetails[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```

### Explanation:

1. **ERC721 Implementation**: The contract extends `ERC721`, `ERC721URIStorage`, and `ERC721Royalty` to create a non-fungible token (NFT) that represents each scarf.

2. **ScarfDetails Struct**: This struct stores the details of each scarf, including the type of material, quantity, cost, and the name of the farm it was sourced from.

3. **mintScarf Function**: This function allows the owner to mint a new scarf NFT. It takes the recipient's address, a URI for the token metadata, and the details of the scarf. The function stores the scarf details in the `scarfDetails` mapping and mints the NFT.

4. **setRoyalty Function**: This function allows the owner to set the royalty for a specific token. The royalty is paid to the specified receiver whenever the token is sold.

5. **_burn Function**: This internal function overrides the default `_burn` function to also delete the scarf details when a token is burned.

6. **tokenURI Function**: This function returns the URI for the token metadata.

7. **supportsInterface Function**: This function checks if the contract supports a specific interface, which is necessary for ERC721Royalty.

### Suggestions:
- **Metadata**: The `uri` parameter in the `mintScarf` function should point to a JSON file containing additional metadata about the scarf, such as images, descriptions, and other relevant information.
- **Royalties**: Consider setting a default royalty for all tokens in the constructor or a separate function to avoid setting royalties individually for each token.
- **Access Control**: The `onlyOwner` modifier is used to restrict access to certain functions, ensuring that only the owner can mint new scarves or set royalties.

Would you like to add any specific features or further clarify the functionality?
Stream Response Time: 57835.8798828125 ms
{
    "prompt_tokens": 267,
    "completion_tokens": 1166,
    "total_tokens": 1433,
    "prompt_cache_hit_tokens": 64,
    "prompt_cache_miss_tokens": 203
}

**user**: Instead of for each scarf, I want to track the transaction of materials. For each transaction, it should record 1. Material Type (cashmere or wool) 2. Quantity (in kilograms) 3. Cost (in GBP) 4. Origin of the material (country and specific farm) 5. Farm certification status (certified or not certified) 6. Delivery duration (in days) 7. Mode of delivery (air, sea, or land)

**assistant**: To track the transactions of materials rather than individual scarves, we can create a smart contract that records each transaction with the specified details. We'll use a struct to store the transaction details and a mapping to keep track of all transactions. Additionally, we'll implement functions to add new transactions and retrieve transaction details.

Here's a concise implementation of the smart contract:

```solidity
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
```

### Explanation:

1. **Transaction Struct**: This struct stores all the details of a material transaction, including the material type, quantity, cost, origin country and farm, certification status, delivery duration, and mode of delivery.

2. **transactions Mapping**: This mapping stores all the transactions by their unique transaction ID.

3. **addTransaction Function**: This function allows the owner to add a new transaction. It validates the input parameters and stores the transaction details in the `transactions` mapping. An event is emitted to notify listeners of the new transaction.

4. **getTransaction Function**: This function allows anyone to retrieve the details of a specific transaction by its ID.

5. **Event**: The `TransactionAdded` event is emitted whenever a new transaction is added, providing the transaction ID, material type, quantity, and cost.

### Suggestions:
- **Validation**: The `addTransaction` function includes validation to ensure that the material type, quantity, cost, and delivery duration are valid. Additionally, it checks that the delivery mode is one of the allowed values ("air", "sea", or "land").
- **Access Control**: The `onlyOwner` modifier is used to restrict access to the `addTransaction` function, ensuring that only the owner can add new transactions.
- **Gas Optimization**: The contract avoids dynamic arrays and uses a counter to generate unique transaction IDs, which helps in minimizing gas costs.

Would you like to add any specific features or further clarify the functionality?
Stream Response Time: 48039.338134765625 ms

{
    "prompt_tokens": 1534,
    "completion_tokens": 1009,
    "total_tokens": 2543,
    "prompt_cache_hit_tokens": 1408,
    "prompt_cache_miss_tokens": 126
}