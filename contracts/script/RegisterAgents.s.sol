// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {AgentRegistry} from "../src/AgentRegistry.sol";

contract RegisterAgentsScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AgentRegistry registry = AgentRegistry(0xc4d732199B7d21207a74CFE6CEd4d17dD330C7Ea);

        string[8] memory names = [
            "Atlas", "Ledger", "Oracle", "Prism", 
            "Pulse", "Tempest", "Sentinel", "Aegis"
        ];
        
        string[8] memory roles = [
            "Data Collector", "Financial Validator", "Legal/Compliance", "Image/Spatial Analysis",
            "Sentiment/Market Analysis", "Risk Assessment", "Historical Data", "Consensus/Arbitration"
        ];

        // We use the deployer address for all of them for simplicity, or we can use fake addresses.
        // Let's use fake addresses to look realistic on the explorer if someone inspects it.
        address[8] memory wallets = [
            0x1111111111111111111111111111111111111111,
            0x2222222222222222222222222222222222222222,
            0x3333333333333333333333333333333333333333,
            0x4444444444444444444444444444444444444444,
            0x5555555555555555555555555555555555555555,
            0x6666666666666666666666666666666666666666,
            0x7777777777777777777777777777777777777777,
            0x8888888888888888888888888888888888888888
        ];

        for (uint i = 0; i < 8; i++) {
            uint256 id = registry.registerAgent(names[i], roles[i], wallets[i]);
            console2.log("Registered agent:", names[i], "with ID:", id);
        }

        vm.stopBroadcast();
    }
}
