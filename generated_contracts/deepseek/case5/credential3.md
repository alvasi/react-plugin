**system**: You are a useful coder that codes secure solidity smart contracts based on user's prompt. Only generate contracts in compliance with legal and ethical standards, excluding any military, surveillance, or unlawful applications. Implement appropriate standards such as ERC20 (fungible), ERC721 (non-fungible), ERC1155 (mix of fungible & non-fungible), and ERC2981 (NFT royalty) if applicable. Avoid vulnerabilities such as reentrancy with check-effects-interaction and avoid low level calls. Validate arguments with require or assert statements. Minimise gas costs by caching and avoiding for loops over dynamic arrays. Use Ownable2Step instead of Ownable from openzeppelin if needed and include constructor(address initialOwner) Ownable(initialOwner) {}. Implement as much as possible but be concise. Ask user if further clarification for functionality is needed and provide suggestions based on context.

**user**: I want a contract to issue tokens as course micro-credentials once students achieve a specific pass mark. The contract should also allow for credential verification and potential revocation. However, these tokens should be non-transferable.

**assistant**: Certainly! Based on your requirements, it sounds like you need an ERC721-based contract that issues non-transferable tokens as course micro-credentials. These tokens will be awarded to students who achieve a specific pass mark, and the contract will allow for credential verification and potential revocation.

Here's a concise implementation of the contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CourseMicroCredential is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Credential {
        uint256 passMark;
        bool revoked;
    }

    mapping(uint256 => Credential) private _credentials;
    mapping(address => uint256[]) private _studentCredentials;

    event CredentialIssued(address indexed student, uint256 tokenId, uint256 passMark);
    event CredentialRevoked(uint256 indexed tokenId);

    constructor(address initialOwner) ERC721("CourseMicroCredential", "CMC") Ownable(initialOwner) {}

    function issueCredential(address student, uint256 passMark) external onlyOwner {
        require(passMark > 0, "Pass mark must be greater than zero");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(student, tokenId);
        _credentials[tokenId] = Credential(passMark, false);
        _studentCredentials[student].push(tokenId);
        emit CredentialIssued(student, tokenId, passMark);
    }

    function revokeCredential(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        _credentials[tokenId].revoked = true;
        emit CredentialRevoked(tokenId);
    }

    function verifyCredential(uint256 tokenId) external view returns (bool isValid, uint256 passMark) {
        require(_exists(tokenId), "Token does not exist");
        Credential memory credential = _credentials[tokenId];
        return (!credential.revoked, credential.passMark);
    }

    function getStudentCredentials(address student) external view returns (uint256[] memory) {
        return _studentCredentials[student];
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override {
        require(from == address(0) || to == address(0), "Token is non-transferable");
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
```

### Key Features:

1. **Non-Transferable Tokens**: The `_beforeTokenTransfer` function ensures that the tokens cannot be transferred by checking if the transfer is from or to the zero address.
2. **Credential Issuance**: The `issueCredential` function allows the owner to issue a credential to a student with a specific pass mark.
3. **Credential Revocation**: The `revokeCredential` function allows the owner to revoke a credential.
4. **Credential Verification**: The `verifyCredential` function allows anyone to verify the validity and pass mark of a credential.
5. **Student Credentials**: The `getStudentCredentials` function allows querying all credentials issued to a specific student.

### Suggestions:

- **ERC2981 Royalty**: If you want to implement royalties for future use cases (e.g., if the contract evolves to allow transferability), you can extend the contract to support ERC2981.
- **Gas Optimization**: The contract is already optimized to some extent, but further optimizations can be made based on specific usage patterns.

Would you like any further clarifications or additional features?
Stream Response Time: 43917.14697265625 ms
{
"prompt_tokens": 266,
"completion_tokens": 935,
"total_tokens": 1201,
"prompt_cache_hit_tokens": 192,
"prompt_cache_miss_tokens": 74
}

**user**: Fix the error: DeclarationError: Undeclared identifier. --> contracts/test3/case5.sol:36:17: | 36 | require(\_exists(tokenId), "Token does not exist"); | ^^^^^^^

**assistant**: Apologies for the oversight. The `_exists` function is not directly available in the ERC721 contract. Instead, we should use the `ownerOf` function to check if the token exists. Here's the corrected version of the contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CourseMicroCredential is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Credential {
        uint256 passMark;
        bool revoked;
    }

    mapping(uint256 => Credential) private _credentials;
    mapping(address => uint256[]) private _studentCredentials;

    event CredentialIssued(address indexed student, uint256 tokenId, uint256 passMark);
    event CredentialRevoked(uint256 indexed tokenId);

    constructor(address initialOwner) ERC721("CourseMicroCredential", "CMC") Ownable(initialOwner) {}

    function issueCredential(address student, uint256 passMark) external onlyOwner {
        require(passMark > 0, "Pass mark must be greater than zero");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(student, tokenId);
        _credentials[tokenId] = Credential(passMark, false);
        _studentCredentials[student].push(tokenId);
        emit CredentialIssued(student, tokenId, passMark);
    }

    function revokeCredential(uint256 tokenId) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        _credentials[tokenId].revoked = true;
        emit CredentialRevoked(tokenId);
    }

    function verifyCredential(uint256 tokenId) external view returns (bool isValid, uint256 passMark) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        Credential memory credential = _credentials[tokenId];
        return (!credential.revoked, credential.passMark);
    }

    function getStudentCredentials(address student) external view returns (uint256[] memory) {
        return _studentCredentials[student];
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override {
        require(from == address(0) || to == address(0), "Token is non-transferable");
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
```

### Key Changes:

1. **Token Existence Check**: Replaced `_exists(tokenId)` with `ownerOf(tokenId) != address(0)` to check if the token exists.

This should resolve the `DeclarationError: Undeclared identifier` error. Would you like any further clarifications or additional features?
Stream Response Time: 35936.535888671875 ms

{
"prompt_tokens": 1264,
"completion_tokens": 754,
"total_tokens": 2018,
"prompt_cache_hit_tokens": 1152,
"prompt_cache_miss_tokens": 112
}
