// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TruthCertificateNFT.sol";
import "../src/VerificationManager.sol";
import "../src/AgentRegistry.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";

contract TruthCertificateNFTTest is Test {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    TruthCertificateNFT nftContract;
    VerificationManager vmContract;
    AgentRegistry agentRegistry;
    
    address owner = address(1);
    address user = address(2);
    uint256 backendPrivateKey = 0x1234567890123456789012345678901234567890123456789012345678901234;
    address backendSigner;

    function setUp() public {
        backendSigner = vm.addr(backendPrivateKey);
        
        vm.startPrank(owner);
        agentRegistry = new AgentRegistry(owner);
        vmContract = new VerificationManager(owner, address(agentRegistry));
        vmContract.setBackendSigner(backendSigner);
        
        nftContract = new TruthCertificateNFT(owner, address(vmContract));
        vm.stopPrank();
    }

    function resolveCaseHelper(string memory assetId, uint8 score, string memory evidenceHash) internal {
        bytes32 messageHash = keccak256(abi.encodePacked(assetId, score, evidenceHash));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(backendPrivateKey, ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.prank(user);
        vmContract.resolveCase(assetId, score, evidenceHash, signature);
    }

    function test_MintCertificate_Success() public {
        string memory assetId = "REG-123";
        uint8 score = 95;
        string memory evidenceHash = "0xABC";
        
        resolveCaseHelper(assetId, score, evidenceHash);

        vm.prank(user);
        uint256 tokenId = nftContract.mintCertificate(user, assetId, score, 30 days, evidenceHash);
        
        assertEq(nftContract.ownerOf(tokenId), user);
        
        (string memory fetchedAssetId, uint8 fetchedScore, , , string memory fetchedHash) = nftContract.truthRecords(tokenId);
        assertEq(fetchedAssetId, assetId);
        assertEq(fetchedScore, score);
        assertEq(fetchedHash, evidenceHash);
    }

    function test_MintCertificate_Revert_UnresolvedAsset() public {
        vm.prank(user);
        vm.expectRevert("Asset verification not resolved");
        nftContract.mintCertificate(user, "REG-UNRESOLVED", 95, 30 days, "0xDEF");
    }

    function test_ApplyTruthDecay_Revert_NonOwner() public {
        string memory assetId = "REG-123";
        resolveCaseHelper(assetId, 95, "0xABC");
        
        vm.prank(user);
        uint256 tokenId = nftContract.mintCertificate(user, assetId, 95, 30 days, "0xABC");
        
        vm.prank(user);
        vm.expectRevert(); // OwnableUnauthorizedAccount
        nftContract.applyTruthDecay(tokenId);
    }
}
