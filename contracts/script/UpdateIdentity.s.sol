pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/StudentIdentity.sol";
import "../src/DepositPool.sol";
import "../src/MonAsk.sol";

contract UpdateIdentityScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address depositPoolAddr = 0x4619cd5838ee884538367fFd82033DF0e5CC1e37;
        address monaskAddr = 0x182628cA13d3769C107B9b75A6617b281DE6ac08;

        vm.startBroadcast(deployerPrivateKey);

        // Deploy new StudentIdentity with selfVerify
        StudentIdentity newIdentity = new StudentIdentity();

        // Update DepositPool and MonAsk to use new identity
        DepositPool(depositPoolAddr).setIdentity(address(newIdentity));
        MonAsk(monaskAddr).setIdentity(address(newIdentity));

        vm.stopBroadcast();

        console.log("New StudentIdentity:", address(newIdentity));
    }
}
