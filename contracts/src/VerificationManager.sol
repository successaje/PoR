// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AgentRegistry.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";

contract VerificationManager is Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address public backendSigner;
    mapping(string => bool) public resolvedAssets;
    mapping(string => uint8) public assetScores;
    mapping(string => string) public assetEvidenceHashes;

    AgentRegistry public agentRegistry;

    event CaseResolved(string indexed assetId, uint8 consensusScore, string evidenceHash);
    event BackendSignerUpdated(address indexed newSigner);

    constructor(address initialOwner, address _agentRegistryAddress) Ownable(initialOwner) {
        agentRegistry = AgentRegistry(_agentRegistryAddress);
        backendSigner = initialOwner; // Default to deployer
    }

    function setBackendSigner(address _signer) external onlyOwner {
        require(_signer != address(0), "Invalid address");
        backendSigner = _signer;
        emit BackendSignerUpdated(_signer);
    }

    /**
     * @dev Resolves a case based on AI backend consensus.
     * The backend signs the payload to prevent unauthorized resolutions.
     */
    function resolveCase(
        string memory assetId,
        uint8 consensusScore,
        string memory evidenceHash,
        bytes memory signature
    ) external {
        require(!resolvedAssets[assetId], "Asset already resolved");
        
        // Construct the message hash
        bytes32 messageHash = keccak256(abi.encodePacked(assetId, consensusScore, evidenceHash));
        
        // Recover the signer
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);
        
        require(signer == backendSigner, "Invalid backend signature");

        // Mark as resolved
        resolvedAssets[assetId] = true;
        assetScores[assetId] = consensusScore;
        assetEvidenceHashes[assetId] = evidenceHash;

        emit CaseResolved(assetId, consensusScore, evidenceHash);
    }
}
