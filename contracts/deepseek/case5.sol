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