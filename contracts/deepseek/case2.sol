// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract HealthRecordManager is Ownable2Step {
    enum Role { None, Doctor, Patient, Hospital }

    struct PatientRecord {
        bytes encryptedData;
        bool exists;
    }

    mapping(address => Role) public roles;
    mapping(address => PatientRecord) private patientRecords;

    event RecordAccessed(address indexed patient, address indexed entity);
    event RecordUpdated(address indexed patient, address indexed entity, bytes newData);
    event RoleAssigned(address indexed entity, Role role);
    event RoleRevoked(address indexed entity);

    constructor(address initialOwner) Ownable(initialOwner) {}

    modifier onlyRole(Role role) {
        require(roles[msg.sender] == role, "Unauthorized access");
        _;
    }

    function assignRole(address entity, Role role) external onlyOwner {
        require(entity != address(0), "Invalid address");
        roles[entity] = role;
        emit RoleAssigned(entity, role);
    }

    function revokeRole(address entity) external onlyOwner {
        require(entity != address(0), "Invalid address");
        roles[entity] = Role.None;
        emit RoleRevoked(entity);
    }

    function registerPatient(address patient, bytes memory encryptedData) external onlyRole(Role.Doctor) {
        require(roles[patient] == Role.None, "Patient already registered");
        roles[patient] = Role.Patient;
        patientRecords[patient] = PatientRecord(encryptedData, true);
        emit RecordUpdated(patient, msg.sender, encryptedData);
    }

    function updateRecord(address patient, bytes memory encryptedData) external onlyRole(Role.Doctor) {
        require(patientRecords[patient].exists, "Record does not exist");
        patientRecords[patient].encryptedData = encryptedData;
        emit RecordUpdated(patient, msg.sender, encryptedData);
    }

    function getRecord(address patient) external returns (bytes memory) {
        require(patientRecords[patient].exists, "Record does not exist");
        require(roles[msg.sender] == Role.Doctor || (roles[msg.sender] == Role.Patient && msg.sender == patient), "Unauthorized access");
        emit RecordAccessed(patient, msg.sender);
        return patientRecords[patient].encryptedData;
    }

    function deleteRecord(address patient) external onlyRole(Role.Doctor) {
        require(patientRecords[patient].exists, "Record does not exist");
        delete patientRecords[patient];
        emit RecordUpdated(patient, msg.sender, "");
    }
}