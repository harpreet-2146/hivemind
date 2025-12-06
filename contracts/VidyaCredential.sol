// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VidyaCredential {
    struct Credential {
        string conceptId;
        string conceptName;
        uint256 timestamp;
        uint8 score;
    }
    
    mapping(address => Credential[]) public studentCredentials;
    mapping(address => mapping(string => bool)) public hasCompleted;
    
    event CredentialIssued(
        address indexed student,
        string conceptId,
        string conceptName,
        uint8 score,
        uint256 timestamp
    );
    
    function issueCredential(
        string memory _conceptId,
        string memory _conceptName,
        uint8 _score
    ) public {
        require(_score >= 60, "Score must be at least 60 to earn credential");
        require(!hasCompleted[msg.sender][_conceptId], "Already completed this concept");
        
        Credential memory newCred = Credential({
            conceptId: _conceptId,
            conceptName: _conceptName,
            timestamp: block.timestamp,
            score: _score
        });
        
        studentCredentials[msg.sender].push(newCred);
        hasCompleted[msg.sender][_conceptId] = true;
        
        emit CredentialIssued(msg.sender, _conceptId, _conceptName, _score, block.timestamp);
    }
    
    function getCredentials(address _student) public view returns (Credential[] memory) {
        return studentCredentials[_student];
    }
    
    function getCredentialCount(address _student) public view returns (uint256) {
        return studentCredentials[_student].length;
    }
    
    function verifyCompletion(address _student, string memory _conceptId) public view returns (bool) {
        return hasCompleted[_student][_conceptId];
    }
}