pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/StudentIdentity.sol";
import "../src/DepositPool.sol";
import "../src/MonAsk.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1_000_000 * 10 ** 6);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract MonAskTest is Test {
    MockUSDC public usdc;
    StudentIdentity public identity;
    DepositPool public depositPool;
    MonAsk public monask;

    address student = address(0x123);
    address liquidator = address(0x456);

    function setUp() public {
        usdc = new MockUSDC();
        identity = new StudentIdentity();
        depositPool = new DepositPool(address(usdc), address(identity));
        monask = new MonAsk(address(usdc), address(identity), address(depositPool));

        usdc.transfer(student, 1000 * 10 ** 6);
        usdc.transfer(address(monask), 10_000 * 10 ** 6);
    }

    function test_VerifyStudent() public {
        vm.startPrank(address(this));
        identity.verifyStudent(student, "student.ac.id", keccak256("card_hash"));
        vm.stopPrank();

        assertTrue(identity.isVerified(student));
    }

    function test_CreateAndDeposit() public {
        vm.startPrank(address(this));
        identity.verifyStudent(student, "student.ac.id", keccak256("card_hash"));
        vm.stopPrank();

        vm.startPrank(student);
        usdc.approve(address(depositPool), 100 * 10 ** 6);
        depositPool.createPlan(48, 10 * 10 ** 6);

        vm.warp(block.timestamp + 1 days);
        depositPool.deposit(10 * 10 ** 6);
        vm.stopPrank();

        assertEq(depositPool.getMonthsCompleted(student), 1);
    }

    function test_BorrowAfterThreeDeposits() public {
        vm.startPrank(address(this));
        identity.verifyStudent(student, "student.ac.id", keccak256("card_hash"));
        vm.stopPrank();

        vm.startPrank(student);
        usdc.approve(address(depositPool), 1000 * 10 ** 6);
        depositPool.createPlan(48, 10 * 10 ** 6);

        for (uint256 i = 0; i < 3; i++) {
            vm.warp(block.timestamp + 30 days);
            depositPool.deposit(10 * 10 ** 6);
        }

        assertEq(depositPool.getMonthsCompleted(student), 3);

        bool canB = monask.canBorrow(student);
        assertTrue(canB);

        uint256 limit = monask.getBorrowLimit(student);
        assertEq(limit, 21 * 10 ** 6);

        monask.borrow(20 * 10 ** 6);
        assertTrue(monask.getCurrentDebt(student) > 0);
        vm.stopPrank();
    }
}
