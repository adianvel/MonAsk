pragma solidity ^0.8.28;

struct DepositPlan {
    address student;
    uint256 tenorMonths;
    uint256 minimumDeposit;
    uint256 startTime;
    uint256 totalDeposited;
    uint256 monthsCompleted;
    bool active;
}

struct Loan {
    uint256 amount;
    uint256 interest;
    uint256 startTime;
    uint256 duration;
    bool active;
}

interface IStudentIdentity {
    function isVerified(address user) external view returns (bool);
    function verifyStudent(address student, string memory emailDomain, bytes32 cardHash) external returns (uint256);
}

interface IDepositPool {
    function deposit(uint256 amount) external;
    function getTotalDeposited(address student) external view returns (uint256);
    function getMonthsCompleted(address student) external view returns (uint256);
    function createPlan(uint256 tenorMonths, uint256 minimumDeposit) external;
    function isPlanActive(address student) external view returns (bool);
}

interface ICollateralManager {
    function getBorrowLimit(address student) external view returns (uint256);
    function getHealthFactor(address student) external view returns (uint256);
    function canBorrow(address student, uint256 amount) external view returns (bool);
}
