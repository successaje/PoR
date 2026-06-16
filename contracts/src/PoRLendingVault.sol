// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TruthCertificateNFT} from "./TruthCertificateNFT.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

/**
 * @title PoRLendingVault
 * @dev A mock Mantle DeFi protocol demonstrating Proof-of-Reality (PoR) integration.
 * This contract allows users to borrow against Real-World Assets (RWAs) or physical events,
 * but only if the PoR AI consensus score is healthy and the Truth Certificate hasn't decayed.
 */
contract PoRLendingVault {
    TruthCertificateNFT public truthOracle;
    
    // Mapping of assetId (string) to borrow amount
    mapping(string => uint256) public activeLoans;

    event LoanApproved(string assetId, uint256 amount, uint8 consensusScore);
    event LoanRejected(string assetId, string reason);
    event AssetLiquidated(string assetId, string reason);

    constructor(address _truthOracle) {
        truthOracle = TruthCertificateNFT(_truthOracle);
    }

    /**
     * @dev Attempt to borrow funds against a Reality Asset verified by PoR.
     * @param tokenId The PoR Truth Certificate NFT token ID
     * @param borrowAmount The amount of stablecoins/ETH requested
     */
    function borrowAgainstRealityAsset(uint256 tokenId, uint256 borrowAmount) external {
        // 1. Query the AI Consensus layer (PoR)
        (
            string memory assetId,
            uint8 consensusScore,
            uint256 verificationTimestamp,
            uint256 decayTimer,
            
        ) = truthOracle.truthRecords(tokenId);

        // 2. Security Check 1: Ensure asset actually exists in PoR registry
        require(bytes(assetId).length > 0, "Asset not verified by Proof-of-Reality");

        // 3. Security Check 2: The Truth Score must be high (no fraud, no damage)
        require(consensusScore >= 80, "PoR Truth Score too low for collateralization");

        // 4. Security Check 3: Dynamic Truth Decay
        // If the certificate is stale, reality might have changed (e.g. building burned down).
        require(block.timestamp <= verificationTimestamp + decayTimer, "PoR Certificate expired. Must re-verify.");

        // 5. Approve Loan
        activeLoans[assetId] += borrowAmount;
        
        emit LoanApproved(assetId, borrowAmount, consensusScore);
    }

    /**
     * @dev Anyone can call this to liquidate an asset if the PoR Reality Score drops.
     * e.g., if PoR's Tempest agent detects a flood at the property, or the Prism agent detects fraud.
     */
    function liquidateUnsafeAsset(uint256 tokenId) external {
        (
            string memory assetId,
            uint8 consensusScore,
            ,
            ,
            
        ) = truthOracle.truthRecords(tokenId);

        require(activeLoans[assetId] > 0, "No active loan for this asset");
        require(consensusScore < 80, "Asset is still healthy according to PoR");

        // Mock Liquidation Logic
        activeLoans[assetId] = 0;

        emit AssetLiquidated(assetId, "PoR Consensus Score fell below safe threshold");
    }
}
