**system**: You are a useful coder that codes secure solidity smart contracts based on user's prompt. Only generate contracts in compliance with legal and ethical standards, excluding any military, surveillance, or unlawful applications. Implement appropriate standards such as ERC20 (fungible), ERC721 (non-fungible), ERC1155 (mix of fungible & non-fungible), and ERC2981 (NFT royalty) if applicable. Use strictly Solidity Pragma version (0.8.27). Ensure minting functions includes proper access control mechanisms. Avoid vulnerabilities such as reentrancy with check-effects-interaction and avoid low level calls. Validate arguments with require or assert statements. Minimise gas costs by caching and avoiding for loops over dynamic arrays. Minimise number of critical functions accessible to owners (try not to use Ownable or Ownable2Step). Use Roles.sol if role-based access control is required. Implement as much as possible but be concise. Ask user if further clarification for functionality is needed and provide suggestions based on context.

**user**: I want a contract to issue tokens as course micro-credentials once students achieve a specific pass mark. The contract should also allow for credential verification and potential revocation. However, these tokens should be non-transferable.

**assistant**: Certainly! Below is a Solidity smart contract that issues non-transferable ERC721 tokens as course micro-credentials. The contract includes functionality for credential verification and potential revocation. The tokens are non-transferable, meaning they cannot be transferred or sold.

### Contract: `CourseMicroCredential`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CourseMicroCredential is ERC721, ERC721Enumerable, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant REVOKE_ROLE = keccak256("REVOKE_ROLE");

    struct Credential {
        uint256 passMark;
        bool isRevoked;
    }

    mapping(uint256 => Credential) private _credentials;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ISSUER_ROLE, msg.sender);
        _setupRole(REVOKE_ROLE, msg.sender);
    }

    function issueCredential(address student, uint256 passMark) external onlyRole(ISSUER_ROLE) {
        require(passMark > 0, "Pass mark must be greater than zero");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(student, tokenId);
        _credentials[tokenId] = Credential({passMark: passMark, isRevoked: false});
    }

    function revokeCredential(uint256 tokenId) external onlyRole(REVOKE_ROLE) {
        require(_exists(tokenId), "Token does not exist");
        _credentials[tokenId].isRevoked = true;
    }

    function verifyCredential(uint256 tokenId) external view returns (bool isValid, uint256 passMark) {
        require(_exists(tokenId), "Token does not exist");
        Credential memory credential = _credentials[tokenId];
        return (!credential.isRevoked, credential.passMark);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        require(from == address(0) || to == address(0), "Token is non-transferable");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```

### Key Features:

1. **Non-Transferable Tokens**: The tokens are non-transferable, meaning they cannot be transferred or sold. This is enforced by overriding the `_beforeTokenTransfer` function.

2. **Role-Based Access Control**: The contract uses `AccessControl` from OpenZeppelin to manage roles. There are two main roles:

   - `ISSUER_ROLE`: Allows the issuance of new credentials.
   - `REVOKE_ROLE`: Allows the revocation of existing credentials.

3. **Credential Issuance**: The `issueCredential` function mints a new ERC721 token and associates it with a specific pass mark.

4. **Credential Revocation**: The `revokeCredential` function allows authorized users to revoke a credential, marking it as invalid.

5. **Credential Verification**: The `verifyCredential` function allows anyone to verify the validity and pass mark of a credential.

### Suggestions:

- **Metadata**: You might want to extend this contract to include metadata for the credentials, such as course name, date of issuance, etc. This can be done by overriding the `tokenURI` function.
- **Batch Operations**: Consider adding batch operations for issuing and revoking credentials to reduce gas costs for multiple operations.

Would you like to add any additional features or modify the existing functionality?
Stream Response Time: 58996.86083984375 ms
{
"prompt_tokens": 298,
"completion_tokens": 1056,
"total_tokens": 1354,
"prompt_cache_hit_tokens": 256,
"prompt_cache_miss_tokens": 42
}
