// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";

contract TruthCertificateNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;

    // Mapping from token ID to Consensus Data
    mapping(uint256 => TruthData) public truthRecords;

    struct TruthData {
        string assetId;
        uint8 consensusScore;
        uint256 verificationTimestamp;
        uint256 decayTimer;
        string evidenceHash;
    }

    event TruthCertificateMinted(uint256 indexed tokenId, string assetId, uint8 consensusScore);
    event TruthDecayed(uint256 indexed tokenId, uint8 newScore);

    constructor(address initialOwner) ERC721("Truth Certificate", "TRUTH") Ownable(initialOwner) {}

    function mintCertificate(
        address to,
        string memory assetId,
        uint8 consensusScore,
        uint256 decayTimer,
        string memory evidenceHash
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        truthRecords[tokenId] = TruthData({
            assetId: assetId,
            consensusScore: consensusScore,
            verificationTimestamp: block.timestamp,
            decayTimer: decayTimer,
            evidenceHash: evidenceHash
        });

        emit TruthCertificateMinted(tokenId, assetId, consensusScore);
        return tokenId;
    }

    // Simulated ERC-8004 concept (Dynamic Truth Decay)
    function applyTruthDecay(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        TruthData storage data = truthRecords[tokenId];
        
        require(block.timestamp > data.verificationTimestamp + data.decayTimer, "Decay timer not reached");
        require(data.consensusScore > 0, "Score already 0");
        
        // Decay by 5% every decay interval
        uint8 decayAmount = 5;
        if(data.consensusScore >= decayAmount) {
            data.consensusScore -= decayAmount;
        } else {
            data.consensusScore = 0;
        }
        
        // Reset timer for next decay
        data.verificationTimestamp = block.timestamp;
        
        emit TruthDecayed(tokenId, data.consensusScore);
    }
}
