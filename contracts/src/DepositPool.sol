pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IMonAsk.sol";

contract DepositPool is IDepositPool, Ownable, ReentrancyGuard {
    IERC20 public stablecoin;
    IStudentIdentity public identity;

    mapping(address => DepositPlan) public plans;
    mapping(address => uint256) public totalDeposited;
    mapping(address => uint256) public lastDepositTime;
    mapping(address => uint256) public lastDepositMonth;
    mapping(address => uint256) public monthsCompleted;
    mapping(address => uint256) public accruedYield;

    uint256 public constant GRACE_PERIOD = 30 days;
    uint256 public constant LIQUIDATION_PERIOD = 60 days;

    event PlanCreated(address indexed student, uint256 tenorMonths, uint256 minimumDeposit);
    event Deposited(address indexed student, uint256 amount, uint256 month);
    event Withdrawn(address indexed student, uint256 amount);
    event PlanClosed(address indexed student);

    constructor(address _stablecoin, address _identity) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
        identity = IStudentIdentity(_identity);
    }

    function setIdentity(address _identity) external onlyOwner {
        identity = IStudentIdentity(_identity);
    }

    function createPlan(uint256 tenorMonths, uint256 minimumDeposit_) external {
        require(identity.isVerified(msg.sender), "Not verified");
        require(!plans[msg.sender].active, "Plan exists");
        require(tenorMonths > 0, "Invalid tenor");
        require(minimumDeposit_ > 0, "Invalid min deposit");

        plans[msg.sender] = DepositPlan({
            student: msg.sender,
            tenorMonths: tenorMonths,
            minimumDeposit: minimumDeposit_,
            startTime: block.timestamp,
            totalDeposited: 0,
            monthsCompleted: 0,
            active: true
        });
        lastDepositMonth[msg.sender] = type(uint256).max;

        emit PlanCreated(msg.sender, tenorMonths, minimumDeposit_);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(plans[msg.sender].active, "No active plan");
        require(amount >= plans[msg.sender].minimumDeposit, "Below minimum");

        stablecoin.transferFrom(msg.sender, address(this), amount);

        uint256 currentMonth = getCurrentMonth(msg.sender);
        require(currentMonth != lastDepositMonth[msg.sender], "Already deposited this month");

        totalDeposited[msg.sender] += amount;
        plans[msg.sender].totalDeposited += amount;
        monthsCompleted[msg.sender] += 1;
        lastDepositMonth[msg.sender] = currentMonth;
        lastDepositTime[msg.sender] = block.timestamp;

        emit Deposited(msg.sender, amount, currentMonth);
    }

    function getCurrentMonth(address student) public view returns (uint256) {
        if (!plans[student].active) return 0;
        return (block.timestamp - plans[student].startTime) / 30 days;
    }

    function getTotalDeposited(address student) external view returns (uint256) {
        return totalDeposited[student];
    }

    function getMonthsCompleted(address student) external view returns (uint256) {
        return monthsCompleted[student];
    }

    function isPlanActive(address student) external view returns (bool) {
        DepositPlan memory plan = plans[student];
        if (!plan.active) return false;
        if (monthsCompleted[student] >= plan.tenorMonths) return false;
        return true;
    }

    function isInGracePeriod(address student) external view returns (bool) {
        if (monthsCompleted[student] == 0) return true;
        return (block.timestamp - lastDepositTime[student]) < GRACE_PERIOD;
    }

    function canLiquidate(address student) external view returns (bool) {
        if (monthsCompleted[student] == 0) return false;
        return (block.timestamp - lastDepositTime[student]) > LIQUIDATION_PERIOD;
    }

    function closePlan() external nonReentrant {
        require(plans[msg.sender].active, "No active plan");
        plans[msg.sender].active = false;
        uint256 amount = totalDeposited[msg.sender];
        totalDeposited[msg.sender] = 0;
        stablecoin.transfer(msg.sender, amount + accruedYield[msg.sender]);
        emit PlanClosed(msg.sender);
    }
}
