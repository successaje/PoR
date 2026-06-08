# Smart Contract Integration Checklist

This document tracks the mapping between the theoretical PoR system flow and the actual on-chain functions in the Mantle smart contracts. It highlights connected functions, missing functions, and partially implemented flows that require frontend updates.

## Critical Actions Audit

| Action Needed | Contract Map | Status | Notes |
|---|---|---|---|
| `createVerificationCase()` | `VerificationManager.createCase(string _assetId)` | 🟡 Partially Connected | Exists in contract. Needs `useWriteContract` hook implemented in the frontend (`verify/page.tsx`). |
| `submitAgentReport()` | 🔴 Missing | 🔴 Disconnected | Currently, agent reports exist only off-chain / in the mock engine. If we want cryptographic proofs of individual agent contributions, we need to add `submitReport(uint256 caseId, string evidenceHash)` to `VerificationManager`. |
| `resolveConsensus()` | `VerificationManager.resolveCase(uint256 _caseId, string _result)` | 🟡 Partially Connected | Exists in contract. Needs `useWriteContract` hook implemented in the frontend when Aegis finishes arbitration. |
| `mintTruthCertificate()` | `TruthCertificateNFT.mintCertificate(...)` | 🟢 Connected | Fully scaffolded in `verify/page.tsx`. |
| `updateAgentReputation()` | `AgentRegistry.updateReputation(...)` | 🟡 Partially Connected | Exists in contract. Needs an admin/governance dashboard or automated oracle hook to trigger it post-verification. |

## Required Scaffolding Tasks (TODOs)
1. Add `useWriteContract` stub for `createCase` when the user clicks "Initiate Proof-of-Reality".
2. Add `useWriteContract` stub for `resolveCase` triggered when Aegis finishes meta-consensus.
3. Design decision needed: Do we add `submitAgentReport` on-chain (high gas cost for 7 agents), or anchor only the final Aegis output on-chain and store individual reports on IPFS? (Recommendation: IPFS + Aegis final on-chain anchor).
