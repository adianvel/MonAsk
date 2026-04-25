pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/StudentIdentity.sol";
import "../src/DepositPool.sol";
import "../src/MonAsk.sol";

contract RedeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address oldUsdc = 0x738BdF6a38f28453e07bDeFB5221aFf682965C76;

        vm.startBroadcast(deployerPrivateKey);

        // Use existing MockUSDC
        MockUSDC usdc = MockUSDC(oldUsdc);
        
        // Deploy new protocol contracts
        StudentIdentity identity = new StudentIdentity();
        DepositPool depositPool = new DepositPool(address(usdc), address(identity));
        MonAsk monask = new MonAsk(address(usdc), address(identity), address(depositPool));

        // Send some USDC to MonAsk so it can lend
        usdc.transfer(address(monask), 100_000 * 10 ** 6); // 100k USDC

        vm.stopBroadcast();

        console.log("=== MONASK REDEPLOYMENT ===");
        console.log("MockUSDC:", address(usdc));
        console.log("StudentIdentity:", address(identity));
        console.log("DepositPool:", address(depositPool));
        console.log("MonAsk:", address(monask));
        console.log("===========================");
    }
}
