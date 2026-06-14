// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TruthCertificateNFT} from "../src/TruthCertificateNFT.sol";
import {AgentRegistry} from "../src/AgentRegistry.sol";
import {VerificationManager} from "../src/VerificationManager.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        TruthCertificateNFT nft = new TruthCertificateNFT(deployer);
        console.log("TruthCertificateNFT deployed at:", address(nft));

        AgentRegistry agentRegistry = new AgentRegistry(deployer);
        console.log("AgentRegistry deployed at:", address(agentRegistry));

        VerificationManager verificationManager = new VerificationManager(deployer, address(agentRegistry));
        console.log("VerificationManager deployed at:", address(verificationManager));

        vm.stopBroadcast();
    }
}
