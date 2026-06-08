# Workflow Consistency Audit

This document compares the theoretical Proof-of-Reality (PoR) workflow with our actual implementation across the frontend, backend orchestration, and smart contracts.

## 1. Asset Submission
- **Expected:** User submits asset ID and evidence. A new verification case is created on the blockchain.
- **Actual:** Frontend form exists. **GAP:** Backend endpoint is mocked, and the `VerificationManager.createCase` is not actually being called by the frontend on submission.
- **Fix Required:** Wire the "Initiate Proof-of-Reality" button to trigger the `createCase` contract call and a backend `/api/verification/start` endpoint.

## 2. Node Activation & Parallel Analysis
- **Expected:** The 8 nodes activate. 7 investigate in parallel.
- **Actual:** `mockEngine.ts` generates logs sequentially rather than via real parallel orchestration.
- **Fix Required:** The backend (LangGraph) needs to execute 7 autonomous agent chains in parallel and stream telemetry back to the frontend via WebSockets or SSE.

## 3. Debate Phase
- **Expected:** Agents cross-examine anomalies based on contradicting data.
- **Actual:** Hardcoded anomaly generation in `mockEngine.ts`.
- **Fix Required:** Implement standard LangGraph conditional edges where agents can trigger a "Re-evaluate" cycle if discrepancies are detected.

## 4. Consensus Formation (Aegis)
- **Expected:** Aegis node activates last, consumes the outputs of the 7 nodes, resolves contradictions, and generates a final confidence score.
- **Actual:** Handled correctly in the updated `mockEngine.ts` visual layer, but backend implementation is missing.
- **Fix Required:** Aegis must be implemented as a LangGraph "Reducer" or "Supervisor" node that takes all 7 states as input.

## 5. On-chain Finalization & NFT Mint
- **Expected:** Final result is anchored to `VerificationManager`, followed by the minting of the `TruthCertificateNFT`.
- **Actual:** `TruthCertificateNFT.mintCertificate` is hooked up in the UI, but it skips the `VerificationManager.resolveCase` step.
- **Fix Required:** Update the UI to sequence the contract calls: 1) `resolveCase` 2) `mintCertificate`.
