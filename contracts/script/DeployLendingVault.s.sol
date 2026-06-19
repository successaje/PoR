// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {PoRLendingVault} from "../src/PoRLendingVault.sol";
import {MockERC20} from "../src/MockERC20.sol";

contract DeployLendingVault is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address truthOracleAddress = 0x86C41594e9aDeCcf8c85ba9EEe0138C7c9E70dBc;

        vm.startBroadcast(deployerPrivateKey);

        MockERC20 mETH = new MockERC20("Mantle Staked Ether", "mETH");
        MockERC20 USDY = new MockERC20("Ondo US Dollar Yield", "USDY");

        PoRLendingVault vault = new PoRLendingVault(payable(truthOracleAddress), address(mETH), address(USDY));
        console2.log("PoRLendingVault deployed at:", address(vault));

        vm.stopBroadcast();
    }
}
