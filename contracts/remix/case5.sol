// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract CourseCredential {
    struct Course {
        string name;
        uint passMark;
    }

    struct IssuedCredential {
        bool isRevoked;
        bool isVerified;
    }

    mapping(address => Course) public courses;
    mapping(address => IssuedCredential) public issuedCredentials;

    function issueCredential(address courseAddress, uint mark) public {
        require(!issuedCredentials[courseAddress].isVerified, "Course already verified");
        require(mark >= courses[courseAddress].passMark, "Mark is below pass mark");
        issuedCredentials[courseAddress] = IssuedCredential(false, true);
    }

    function verifyCredential(address courseAddress) public view returns (bool) {
        return issuedCredentials[courseAddress].isVerified;
    }

    function revokeCredential(address courseAddress) public {
        require(msg.sender == courseAddress, "Only course owner can revoke");
        issuedCredentials[courseAddress].isRevoked = true;
    }
}