// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {TruthCertificateNFT} from "../src/TruthCertificateNFT.sol";

contract DeployTruthNFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        TruthCertificateNFT nft = new TruthCertificateNFT(deployer);
        
        vm.stopBroadcast();
    }
}
