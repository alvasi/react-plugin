// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ElectronicHealthRecord  {
    enum Role { Doctor, Patient, Hospital }

    struct User {
        address addr;
        Role role;
    }

    struct Patient {
        string name;
        uint birthdate;
        string gender;
        string medicalHistory;
    }

    mapping(address => User) private users;
    mapping(string => Patient) private patients;

    error Unauthorized();

    constructor() {
        // Add your authorized entities (doctors and hospitals) here
        users[0x1234567890123456789012345678901234567890] = User({addr: 0x1234567890123456789012345678901234567890, role: Role.Doctor});
        users[0x2345678901234567890123456789012345678901] = User({addr: 0x2345678901234567890123456789012345678901, role: Role.Hospital});
    }

    function addPatient(string memory name, uint birthdate, string memory gender, string memory medicalHistory) public {
        require(users[msg.sender].role == Role.Doctor || users[msg.sender].role == Role.Hospital, "Unauthorized");
        patients[name] = Patient(name, birthdate, gender, medicalHistory);
    }

    function getPatient(string memory name) public view returns (string memory, uint, string memory, string memory) {
        require(users[msg.sender].role == Role.Doctor || (users[msg.sender].role == Role.Patient && keccak256(abi.encodePacked(patients[name].name)) == keccak256(abi.encodePacked(msg.sender))), "Unauthorized");
        Patient memory patient = patients[name];
        return (patient.name, patient.birthdate, patient.gender, patient.medicalHistory);
    }

    function updatePatient(string memory name, string memory newMedicalHistory) public {
        require(users[msg.sender].role == Role.Doctor, "Unauthorized");
        Patient memory patient = patients[name];
        patients[name] = Patient(patient.name, patient.birthdate, patient.gender, newMedicalHistory);
    }
}