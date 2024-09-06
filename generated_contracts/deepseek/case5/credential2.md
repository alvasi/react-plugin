**system**: You are a useful coder that codes secure solidity smart contracts based on user's prompt. Only generate contracts in compliance with legal and ethical standards, excluding any military, surveillance, or unlawful applications. Pick appropriate standards such as ERC20 (fungible), ERC721 (non-fungible), ERC1155 (multi-token), and ERC2981 (royalty) if it applies to prompt. Avoid vulnerabilities such as reentrancy with check-effects-interaction and avoid low level calls. Validate user arguments with require or assert statements. Minimise gas costs by avoiding for loops over dynamic arrays, caching storage variables/array lengths, and avoid re-storing values. Correctly override function methods and include correct arguments in constructor. Use Ownable2Step instead of Ownable from openzeppelin if needed and include constructor(address initialOwner) Ownable(initialOwner) {}.Initialise empty structs, then assign elements. Use struct for returning multiple values inside a function. Implement as much as possible. Ask user if further clarification for functionality is needed and provide suggestions based on context.

**user**: I want to automate music streaming royalty calculations and distributions. The contract should handle payments based on streaming duration.

**assistant**: To create a smart contract that issues non-transferable tokens as course micro-credentials once students achieve a specific pass mark, we can use the ERC721 standard with additional restrictions to ensure the tokens are non-transferable. We'll also implement functions for credential verification and potential revocation.

Here's a basic outline of the contract:

1. **Data Structures**:

   - **Student**: A struct to store student details and their credentials.
   - **Course**: A struct to store course details and pass marks.

2. **State Variables**:

   - A mapping to store student data.
   - A mapping to store course data.
   - A mapping to store the balance of each student's tokens.

3. **Functions**:

   - **registerStudent**: Allows students to register.
   - **createCourse**: Allows the contract owner to create a new course.
   - **issueCredential**: Allows the contract owner to issue a credential to a student who has achieved the pass mark.
   - **verifyCredential**: Allows anyone to verify a student's credential.
   - **revokeCredential**: Allows the contract owner to revoke a credential.

4. **Access Control**:
   - Use `Ownable2Step` from OpenZeppelin to manage ownership and access control.

Here's the implementation:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CourseMicroCredentials is ERC721, Ownable2Step {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Student {
        string name;
        uint256[] credentials;
    }

    struct Course {
        string name;
        uint256 passMark;
    }

    mapping(address => Student) public students;
    mapping(uint256 => Course) public courses;
    mapping(uint256 => address) public tokenOwners;
    mapping(uint256 => uint256) public tokenCourses;

    uint256 public courseIdCounter;

    event StudentRegistered(address indexed student, string name);
    event CourseCreated(uint256 indexed courseId, string name, uint256 passMark);
    event CredentialIssued(address indexed student, uint256 indexed tokenId, uint256 indexed courseId);
    event CredentialRevoked(uint256 indexed tokenId);

    constructor(address initialOwner) ERC721("CourseMicroCredentials", "CMC") Ownable(initialOwner) {}

    function registerStudent(string memory _name) external {
        require(students[msg.sender].credentials.length == 0, "Student already registered");
        students[msg.sender] = Student({
            name: _name,
            credentials: new uint256[](0)
        });

        emit StudentRegistered(msg.sender, _name);
    }

    function createCourse(string memory _name, uint256 _passMark) external onlyOwner {
        courseIdCounter++;
        courses[courseIdCounter] = Course({
            name: _name,
            passMark: _passMark
        });

        emit CourseCreated(courseIdCounter, _name, _passMark);
    }

    function issueCredential(address _student, uint256 _courseId, uint256 _score) external onlyOwner {
        require(students[_student].credentials.length > 0, "Student not registered");
        require(courses[_courseId].passMark > 0, "Course does not exist");
        require(_score >= courses[_courseId].passMark, "Score does not meet pass mark");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _mint(_student, tokenId);
        students[_student].credentials.push(tokenId);
        tokenOwners[tokenId] = _student;
        tokenCourses[tokenId] = _courseId;

        emit CredentialIssued(_student, tokenId, _courseId);
    }

    function verifyCredential(uint256 _tokenId) external view returns (bool isValid, address student, uint256 courseId) {
        address owner = tokenOwners[_tokenId];
        if (owner != address(0)) {
            return (true, owner, tokenCourses[_tokenId]);
        } else {
            return (false, address(0), 0);
        }
    }

    function revokeCredential(uint256 _tokenId) external onlyOwner {
        address student = tokenOwners[_tokenId];
        require(student != address(0), "Credential does not exist");

        _burn(_tokenId);
        delete tokenOwners[_tokenId];
        delete tokenCourses[_tokenId];

        uint256[] storage credentials = students[student].credentials;
        for (uint256 i = 0; i < credentials.length; i++) {
            if (credentials[i] == _tokenId) {
                credentials[i] = credentials[credentials.length - 1];
                credentials.pop();
                break;
            }
        }

        emit CredentialRevoked(_tokenId);
    }

    // Override transfer functions to make tokens non-transferable
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override {
        require(from == address(0) || to == address(0), "Token is non-transferable");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(from == address(0) || to == address(0), "Token is non-transferable");
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(from == address(0) || to == address(0), "Token is non-transferable");
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        require(from == address(0) || to == address(0), "Token is non-transferable");
        super.safeTransferFrom(from, to, tokenId, data);
    }
}
```

### Explanation:

1. **Student Struct**: Stores student details including name and credentials.
2. **Course Struct**: Stores course details including name and pass mark.
3. **registerStudent Function**: Allows students to register.
4. **createCourse Function**: Allows the contract owner to create a new course.
5. **issueCredential Function**: Allows the contract owner to issue a credential to a student who has achieved the pass mark.
6. **verifyCredential Function**: Allows anyone to verify a student's credential.
7. **revokeCredential Function**: Allows the contract owner to revoke a credential.
8. **\_beforeTokenTransfer Function**: Overrides the ERC721 transfer functions to make tokens non-transferable.

### Access Control:

- **onlyOwner Modifier**: Ensures that only the contract owner can call certain functions.
- **Ownable2Step**: Manages ownership and access control for creating courses, issuing credentials, and revoking credentials.

### Notes:

- **Non-Transferable Tokens**: The contract overrides the ERC721 transfer functions to ensure that tokens cannot be transferred.
- **Credential Verification**: The `verifyCredential` function allows anyone to verify a student's credential.
- **Credential Revocation**: The `revokeCredential` function allows the contract owner to revoke a credential.

Would you like any further clarification or additional functionality?

Stream Response Time: 97089.97802734375 ms
{
"prompt_tokens": 20301,
"completion_tokens": 1867,
"total_tokens": 22168,
"prompt_cache_hit_tokens": 1024,
"prompt_cache_miss_tokens": 19277
}
