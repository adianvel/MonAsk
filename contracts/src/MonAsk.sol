pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IMonAsk.sol";
import "./StudentIdentity.sol";
import "./DepositPool.sol";

contract MonAsk is Ownable, ReentrancyGuard {
    IERC20 public stablecoin;
    StudentIdentity public identity;
    DepositPool public depositPool;

    mapping(address => Loan) public loans;
    mapping(address => uint256) public totalBorrowed;

    uint256 public constant LTV_RATIO = 70;
    uint256 public constant MIN_BORROW_MONTHS = 3;
    uint256 public constant BASE_INTEREST_RATE = 750;
    uint256 public constant INTEREST_RATE_DENOM = 10000;

    event Borrowed(address indexed student, uint256 amount, uint256 interest);
    event Repaid(address indexed student, uint256 amount);
    event Liquidated(address indexed student);

    constructor(address _stablecoin, address _identity, address _depositPool) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
        identity = StudentIdentity(_identity);
        depositPool = DepositPool(_depositPool);
    }

    function setIdentity(address _identity) external onlyOwner {
        identity = StudentIdentity(_identity);
    }

    function getBorrowLimit(address student) public view returns (uint256) {
        uint256 totalCollateral = depositPool.getTotalDeposited(student);
        return (totalCollateral * LTV_RATIO) / 100;
    }

    function getCurrentDebt(address student) public view returns (uint256) {
        Loan memory loan = loans[student];
        if (!loan.active) return 0;
        uint256 elapsed = block.timestamp - loan.startTime;
        uint256 interestDue = (loan.amount * loan.interest * elapsed) / (365 days * INTEREST_RATE_DENOM);
        return loan.amount + interestDue;
    }

    function getHealthFactor(address student) public view returns (uint256) {
        uint256 debt = getCurrentDebt(student);
        if (debt == 0) return type(uint256).max;
        uint256 limit = getBorrowLimit(student);
        return (limit * 100) / debt;
    }

    function canBorrow(address student) public view returns (bool) {
        require(identity.isVerified(student), "Not verified");
        require(depositPool.isPlanActive(student), "Plan not active");
        uint256 months = depositPool.getMonthsCompleted(student);
        require(months >= MIN_BORROW_MONTHS, "Need more deposits");
        require(!loans[student].active, "Existing loan active");
        return true;
    }

    function borrow(uint256 amount) external nonReentrant {
        require(canBorrow(msg.sender), "Cannot borrow");
        require(amount > 0, "Amount must be > 0");
        uint256 limit = getBorrowLimit(msg.sender);
        require(amount <= limit, "Exceeds borrow limit");

        uint256 interest = BASE_INTEREST_RATE;
        loans[msg.sender] = Loan({
            amount: amount,
            interest: interest,
            startTime: block.timestamp,
            duration: 365 days,
            active: true
        });

        totalBorrowed[msg.sender] += amount;
        stablecoin.transfer(msg.sender, amount);

        emit Borrowed(msg.sender, amount, interest);
    }

    function repay(uint256 amount) external nonReentrant {
        Loan storage loan = loans[msg.sender];
        require(loan.active, "No active loan");

        uint256 debt = getCurrentDebt(msg.sender);
        uint256 repayAmount = amount > debt ? debt : amount;

        stablecoin.transferFrom(msg.sender, address(this), repayAmount);

        if (repayAmount >= debt) {
            loan.active = false;
        }

        emit Repaid(msg.sender, repayAmount);
    }

    function liquidate(address student) external nonReentrant {
        require(depositPool.canLiquidate(student), "Cannot liquidate yet");
        Loan storage loan = loans[student];
        require(loan.active, "No active loan");

        uint256 debt = getCurrentDebt(student);
        uint256 collateral = depositPool.getTotalDeposited(student);
        uint256 seized = debt > collateral ? collateral : debt;

        stablecoin.transferFrom(msg.sender, address(this), seized);
        loan.active = false;
        depositPool.closePlan();

        emit Liquidated(student);
        emit Repaid(student, seized);
    }
}
