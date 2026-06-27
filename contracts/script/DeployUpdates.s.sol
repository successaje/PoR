// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {VerificationManager} from "../src/VerificationManager.sol";
import {TruthCertificateNFT} from "../src/TruthCertificateNFT.sol";

contract DeployUpdates is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Keep existing AgentRegistry
        address agentRegistryAddress = 0x49312b44F8A13b1Ca33F76d08a7c8230b3e0D5e4;

        vm.startBroadcast(deployerPrivateKey);

        VerificationManager verificationManager = new VerificationManager(deployer, agentRegistryAddress);
        console.log("New VerificationManager deployed at:", address(verificationManager));

        TruthCertificateNFT nft = new TruthCertificateNFT(deployer, address(verificationManager));
        console.log("New TruthCertificateNFT deployed at:", address(nft));

        vm.stopBroadcast();
    }
}
