// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/VerificationManager.sol";
import "../src/AgentRegistry.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";

contract VerificationManagerTest is Test {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    VerificationManager vmContract;
    AgentRegistry agentRegistry;
    
    address owner = address(1);
    uint256 backendPrivateKey = 0x1234567890123456789012345678901234567890123456789012345678901234;
    address backendSigner;
    address unauthorized = address(3);

    function setUp() public {
        backendSigner = vm.addr(backendPrivateKey);
        
        vm.startPrank(owner);
        agentRegistry = new AgentRegistry(owner);
        vmContract = new VerificationManager(owner, address(agentRegistry));
        vmContract.setBackendSigner(backendSigner);
        vm.stopPrank();
    }

    function test_ResolveCase_Success() public {
        string memory assetId = "REG-123";
        uint8 score = 95;
        string memory evidenceHash = "0xABC";

        // Create signature
        bytes32 messageHash = keccak256(abi.encodePacked(assetId, score, evidenceHash));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(backendPrivateKey, ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.prank(unauthorized); // Anyone can submit it as long as signature is valid
        vmContract.resolveCase(assetId, score, evidenceHash, signature);

        assertTrue(vmContract.resolvedAssets(assetId));
        assertEq(vmContract.assetScores(assetId), score);
    }

    function test_ResolveCase_Revert_InvalidSignature() public {
        string memory assetId = "REG-123";
        uint8 score = 95;
        string memory evidenceHash = "0xABC";

        // Create signature with WRONG private key
        uint256 wrongPrivateKey = 0x9999;
        bytes32 messageHash = keccak256(abi.encodePacked(assetId, score, evidenceHash));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(wrongPrivateKey, ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.prank(unauthorized);
        vm.expectRevert("Invalid backend signature");
        vmContract.resolveCase(assetId, score, evidenceHash, signature);
    }
}
