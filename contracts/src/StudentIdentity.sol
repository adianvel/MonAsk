pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract StudentIdentity is Ownable {
    uint256 private _nextTokenId;
    mapping(address => bool) public isVerified;
    mapping(address => uint256) public studentTokenId;
    mapping(address => string) public studentEmailDomain;
    mapping(address => bytes32) public studentCardHash;
    mapping(address => uint256) public verificationTime;

    event StudentVerified(address indexed student, string emailDomain, uint256 tokenId);
    event StudentRevoked(address indexed student);

    constructor() Ownable(msg.sender) {}

    function verifyStudent(
        address student,
        string memory emailDomain,
        bytes32 cardHash
    ) external onlyOwner returns (uint256) {
        require(!isVerified[student], "Already verified");
        require(
            bytes(emailDomain).length > 0,
            "Invalid domain"
        );

        _nextTokenId++;
        isVerified[student] = true;
        studentTokenId[student] = _nextTokenId;
        studentEmailDomain[student] = emailDomain;
        studentCardHash[student] = cardHash;
        verificationTime[student] = block.timestamp;

        emit StudentVerified(student, emailDomain, _nextTokenId);
        return _nextTokenId;
    }

    function revokeStudent(address student) external onlyOwner {
        require(isVerified[student], "Not verified");
        isVerified[student] = false;
        emit StudentRevoked(student);
    }
}
