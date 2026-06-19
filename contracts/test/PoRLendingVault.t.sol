// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PoRLendingVault.sol";
import "../src/TruthCertificateNFT.sol";
import "../src/VerificationManager.sol";
import "../src/AgentRegistry.sol";
import "../src/MockERC20.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";

contract PoRLendingVaultTest is Test {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    PoRLendingVault vault;
    TruthCertificateNFT nftContract;
    VerificationManager vmContract;
    AgentRegistry agentRegistry;
    MockERC20 mETH;
    MockERC20 USDY;
    
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
        
        mETH = new MockERC20("Mantle Staked Ether", "mETH");
        USDY = new MockERC20("Ondo US Dollar Yield", "USDY");
        
        vault = new PoRLendingVault(payable(address(nftContract)), address(mETH), address(USDY));
        
        // Fund vault with USDY to lend
        USDY.mint(address(vault), 1000000 ether);
        
        // Fund user with mETH
        mETH.mint(user, 1000 ether);
        
        vm.stopPrank();
        
        vm.prank(user);
        mETH.approve(address(vault), type(uint256).max);
    }

    function resolveAndMint(string memory assetId, uint8 score, uint256 decayTimer) internal returns (uint256) {
        string memory evidenceHash = "0xABC";
        bytes32 messageHash = keccak256(abi.encodePacked(assetId, score, evidenceHash));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(backendPrivateKey, ethSignedMessageHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.prank(user);
        vmContract.resolveCase(assetId, score, evidenceHash, signature);
        
        vm.prank(user);
        return nftContract.mintCertificate(user, assetId, score, decayTimer, evidenceHash);
    }

    function test_Borrow_Success() public {
        uint256 tokenId = resolveAndMint("REG-123", 90, 30 days);
        
        vm.prank(user);
        vault.borrowAgainstRealityAsset(tokenId, 1000 ether, 50 ether); // borrow 1000 USDY, provide 50 mETH
        
        assertEq(vault.activeLoans("REG-123"), 1000 ether);
        assertEq(vault.suppliedmETH("REG-123"), 50 ether);
        assertEq(mETH.balanceOf(address(vault)), 50 ether);
    }

    function test_Borrow_Revert_ExpiredCertificate() public {
        uint256 decayTimer = 30 days;
        uint256 tokenId = resolveAndMint("REG-123", 90, decayTimer);
        
        // Fast forward time past decay timer
        skip(decayTimer + 1 seconds);

        vm.prank(user);
        vm.expectRevert("PoR Certificate expired. Must re-verify.");
        vault.borrowAgainstRealityAsset(tokenId, 1000 ether, 50 ether);
    }
}
