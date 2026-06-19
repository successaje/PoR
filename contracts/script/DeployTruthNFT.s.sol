// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {TruthCertificateNFT} from "../src/TruthCertificateNFT.sol";
import {VerificationManager} from "../src/VerificationManager.sol";
import {AgentRegistry} from "../src/AgentRegistry.sol";

contract DeployTruthNFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        AgentRegistry agentRegistry = new AgentRegistry(deployer);
        VerificationManager verificationManager = new VerificationManager(deployer, address(agentRegistry));
        TruthCertificateNFT nft = new TruthCertificateNFT(deployer, address(verificationManager));
        
        vm.stopBroadcast();
    }
}
