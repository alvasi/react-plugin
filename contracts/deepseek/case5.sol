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
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
        _grantRole(REVOKE_ROLE, msg.sender);
    }

    function issueCredential(address student, uint256 passMark)
        external
        onlyRole(ISSUER_ROLE)
    {
        require(passMark > 0, "Pass mark must be greater than zero");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(student, tokenId);
        _credentials[tokenId] = Credential({
            passMark: passMark,
            isRevoked: false
        });
    }

    function revokeCredential(uint256 tokenId) external onlyRole(REVOKE_ROLE) {
        require(_requireOwned(tokenId) != address(0), "Token does not exist");
        _credentials[tokenId].isRevoked = true;
    }

    function verifyCredential(uint256 tokenId)
        external
        view
        returns (bool isValid, uint256 passMark)
    {
        require(_requireOwned(tokenId) != address(0), "Token does not exist");
        Credential memory credential = _credentials[tokenId];
        return (!credential.isRevoked, credential.passMark);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: Transfer failed");
        }

        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
