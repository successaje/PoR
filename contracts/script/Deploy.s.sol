// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TruthCertificateNFT} from "../src/TruthCertificateNFT.sol";
import {AgentRegistry} from "../src/AgentRegistry.sol";
import {VerificationManager} from "../src/VerificationManager.sol";
import {PoRLendingVault} from "../src/PoRLendingVault.sol";
import {MockERC20} from "../src/MockERC20.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        AgentRegistry agentRegistry = new AgentRegistry(deployer);
        console.log("AgentRegistry deployed at:", address(agentRegistry));

        VerificationManager verificationManager = new VerificationManager(deployer, address(agentRegistry));
        console.log("VerificationManager deployed at:", address(verificationManager));

        TruthCertificateNFT nft = new TruthCertificateNFT(deployer, address(verificationManager));
        console.log("TruthCertificateNFT deployed at:", address(nft));

        MockERC20 mETH = new MockERC20("Mantle Staked Ether", "mETH");
        console.log("Mock mETH deployed at:", address(mETH));

        MockERC20 USDY = new MockERC20("Ondo US Dollar Yield", "USDY");
        console.log("Mock USDY deployed at:", address(USDY));

        PoRLendingVault vault = new PoRLendingVault(payable(address(nft)), address(mETH), address(USDY));
        console.log("PoRLendingVault deployed at:", address(vault));

        vm.stopBroadcast();
    }
}
