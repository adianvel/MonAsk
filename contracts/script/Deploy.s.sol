pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/StudentIdentity.sol";
import "../src/DepositPool.sol";
import "../src/MonAsk.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy Mock USDC (for demo purposes)
        MockUSDC usdc = new MockUSDC(vm.addr(deployerPrivateKey));
        
        // Deploy protocol contracts
        StudentIdentity identity = new StudentIdentity();
        DepositPool depositPool = new DepositPool(address(usdc), address(identity));
        MonAsk monask = new MonAsk(address(usdc), address(identity), address(depositPool));

        // Send some USDC to MonAsk so it can lend
        usdc.transfer(address(monask), 100_000 * 10 ** 6); // 100k USDC

        vm.stopBroadcast();

        console.log("=== MONASK DEPLOYMENT ===");
        console.log("Network: Monad Testnet");
        console.log("MockUSDC:", address(usdc));
        console.log("StudentIdentity:", address(identity));
        console.log("DepositPool:", address(depositPool));
        console.log("MonAsk:", address(monask));
        console.log("=========================");
    }
}
