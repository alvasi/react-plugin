**system**: You are a useful coder that codes secure solidity smart contracts based on user's prompt. Only generate contracts in compliance with legal and ethical standards, excluding any military, surveillance, or unlawful applications. Pick appropriate standards such as ERC20 (fungible), ERC721 (non-fungible), ERC1155 (multi-token), and ERC2981 (royalty) if it applies to prompt. Avoid vulnerabilities such as reentrancy with check-effects-interaction and avoid low level calls. Validate user arguments with require or assert statements. Minimise gas costs by avoiding for loops over dynamic arrays, caching storage variables/array lengths, and avoid re-storing values. Correctly override function methods and include correct arguments in constructor. Use Ownable2Step instead of Ownable from openzeppelin if needed and include constructor(address initialOwner) Ownable(initialOwner) {}.Initialise empty structs, then assign elements. Use struct for returning multiple values inside a function. Implement as much as possible. Ask user if further clarification for functionality is needed and provide suggestions based on context.

**user**: I want a contract to manage patient electronic health records. Only authorised entities (doctors and hospitals) can access or update patient data. Unauthorised attempts will result in session termination.

**assistant**: To create a smart contract that manages patient electronic health records (EHRs) with access control for authorized entities (doctors and hospitals), we can use a combination of mappings and modifiers to ensure that only authorized entities can access or update patient data. We'll also implement a mechanism to terminate sessions for unauthorized attempts.

Here's a basic outline of the contract:

1. **Data Structures**:
   - **Patient**: A struct to store patient details and health records.
   - **AccessRequest**: A struct to store access requests from doctors and hospitals.

2. **State Variables**:
   - A mapping to store patient data.
   - A mapping to store access requests.
   - A mapping to store authorized entities.

3. **Functions**:
   - **addPatient**: Allows authorized entities to add a new patient.
   - **updatePatientRecord**: Allows authorized entities to update patient records.
   - **requestAccess**: Allows doctors and hospitals to request access to patient records.
   - **grantAccess**: Allows the contract owner to grant access to doctors and hospitals.
   - **revokeAccess**: Allows the contract owner to revoke access from doctors and hospitals.
   - **terminateSession**: Terminates the session for unauthorized attempts.

4. **Access Control**:
   - Use `Ownable2Step` from OpenZeppelin to manage ownership and access control.

Here's the implementation:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract PatientEHR is Ownable2Step {
    struct Patient {
        string name;
        uint256 age;
        string medicalHistory;
        string currentCondition;
    }

    struct AccessRequest {
        address requester;
        bool granted;
    }

    mapping(uint256 => Patient) public patients;
    mapping(address => bool) public authorizedEntities;
    mapping(uint256 => AccessRequest[]) public accessRequests;

    event PatientAdded(uint256 indexed patientId, Patient patient);
    event PatientRecordUpdated(uint256 indexed patientId, string medicalHistory, string currentCondition);
    event AccessRequested(uint256 indexed patientId, address requester);
    event AccessGranted(uint256 indexed patientId, address requester);
    event AccessRevoked(uint256 indexed patientId, address requester);
    event SessionTerminated(address indexed requester);

    constructor(address initialOwner) Ownable(initialOwner) {}

    modifier onlyAuthorized() {
        require(authorizedEntities[msg.sender], "Unauthorized access");
        _;
    }

    function addPatient(
        uint256 _patientId,
        string memory _name,
        uint256 _age,
        string memory _medicalHistory,
        string memory _currentCondition
    ) external onlyAuthorized {
        Patient memory newPatient = Patient({
            name: _name,
            age: _age,
            medicalHistory: _medicalHistory,
            currentCondition: _currentCondition
        });

        patients[_patientId] = newPatient;

        emit PatientAdded(_patientId, newPatient);
    }

    function updatePatientRecord(
        uint256 _patientId,
        string memory _medicalHistory,
        string memory _currentCondition
    ) external onlyAuthorized {
        require(bytes(patients[_patientId].name).length > 0, "Patient does not exist");

        patients[_patientId].medicalHistory = _medicalHistory;
        patients[_patientId].currentCondition = _currentCondition;

        emit PatientRecordUpdated(_patientId, _medicalHistory, _currentCondition);
    }

    function requestAccess(uint256 _patientId) external {
        accessRequests[_patientId].push(AccessRequest({
            requester: msg.sender,
            granted: false
        }));

        emit AccessRequested(_patientId, msg.sender);
    }

    function grantAccess(uint256 _patientId, address _requester) external onlyOwner {
        for (uint256 i = 0; i < accessRequests[_patientId].length; i++) {
            if (accessRequests[_patientId][i].requester == _requester) {
                accessRequests[_patientId][i].granted = true;
                authorizedEntities[_requester] = true;
                emit AccessGranted(_patientId, _requester);
                return;
            }
        }

        revert("Access request not found");
    }

    function revokeAccess(uint256 _patientId, address _requester) external onlyOwner {
        for (uint256 i = 0; i < accessRequests[_patientId].length; i++) {
            if (accessRequests[_patientId][i].requester == _requester) {
                accessRequests[_patientId][i].granted = false;
                authorizedEntities[_requester] = false;
                emit AccessRevoked(_patientId, _requester);
                return;
            }
        }

        revert("Access request not found");
    }

    function terminateSession() external {
        emit SessionTerminated(msg.sender);
    }
}
```

### Explanation:

1. **Patient Struct**: Stores patient details including name, age, medical history, and current condition.
2. **AccessRequest Struct**: Stores access requests from doctors and hospitals, including the requester's address and whether the request has been granted.
3. **addPatient Function**: Allows authorized entities to add a new patient.
4. **updatePatientRecord Function**: Allows authorized entities to update patient records.
5. **requestAccess Function**: Allows doctors and hospitals to request access to patient records.
6. **grantAccess Function**: Allows the contract owner to grant access to doctors and hospitals.
7. **revokeAccess Function**: Allows the contract owner to revoke access from doctors and hospitals.
8. **terminateSession Function**: Emits an event to indicate that a session has been terminated due to unauthorized access.

### Access Control:
- **onlyAuthorized Modifier**: Ensures that only authorized entities can call certain functions.
- **Ownable2Step**: Manages ownership and access control for granting and revoking access.

Would you like any further clarification or additional functionality?

Stream Response Time: 82139.3388671875 ms
{
    "prompt_tokens": 2872,
    "completion_tokens": 993,
    "total_tokens": 3865,
    "prompt_cache_hit_tokens": 2816,
    "prompt_cache_miss_tokens": 56
}
