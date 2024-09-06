// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract HealthRecordManager is AccessControl {
    bytes32 private constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 private constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");
    bytes32 private constant PATIENT_ROLE = keccak256("PATIENT_ROLE");

    struct HealthRecord {
        string data;
        bool exists;
    }

    mapping(address => HealthRecord) private patientRecords;

    event RecordUpdated(address indexed patient, address indexed updater, string newData);
    event PatientRegistered(address indexed patient, address indexed registrar);

    modifier onlyAuthorized() {
        require(hasRole(DOCTOR_ROLE, msg.sender) || hasRole(HOSPITAL_ROLE, msg.sender), "Unauthorized access");
        _;
    }

    modifier onlyPatientOrAuthorized(address patient) {
        require(hasRole(PATIENT_ROLE, msg.sender) && msg.sender == patient || hasRole(DOCTOR_ROLE, msg.sender) || hasRole(HOSPITAL_ROLE, msg.sender), "Unauthorized access");
        _;
    }

    function grantDoctorRole(address doctor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DOCTOR_ROLE, doctor);
    }

    function grantHospitalRole(address hospital) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(HOSPITAL_ROLE, hospital);
    }

    function grantPatientRole(address patient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(PATIENT_ROLE, patient);
    }

    function revokeDoctorRole(address doctor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(DOCTOR_ROLE, doctor);
    }

    function revokeHospitalRole(address hospital) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(HOSPITAL_ROLE, hospital);
    }

    function revokePatientRole(address patient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(PATIENT_ROLE, patient);
    }

    function registerPatient(address patient, string memory data) external onlyAuthorized {
        HealthRecord storage record = patientRecords[patient];
        require(!record.exists, "Patient already registered");
        record.data = data;
        record.exists = true;
        _grantRole(PATIENT_ROLE, patient);
        emit PatientRegistered(patient, msg.sender);
    }

    function addOrUpdateRecord(address patient, string memory newData) external onlyAuthorized {
        HealthRecord storage record = patientRecords[patient];
        require(record.exists, "Patient not registered");
        if (keccak256(bytes(record.data)) != keccak256(bytes(newData))) {
            record.data = newData;
            emit RecordUpdated(patient, msg.sender, newData);
        }
    }

    function getRecord(address patient) external view onlyPatientOrAuthorized(patient) returns (string memory) {
        HealthRecord storage record = patientRecords[patient];
        require(record.exists, "Record does not exist");
        return record.data;
    }

    function deleteRecord(address patient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        HealthRecord storage record = patientRecords[patient];
        require(record.exists, "Record does not exist");
        delete patientRecords[patient];
    }
}