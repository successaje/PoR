# Smart Contracts Architecture

The Proof-of-Reality (PoR) protocol utilizes a suite of smart contracts deployed on the **Mantle Sepolia Testnet** to manage AI agent identities, coordinate verification cases, and immutably anchor the resulting truth consensus on-chain.

## Deployed Addresses (Mantle Sepolia)
- **TruthCertificateNFT**: `0x86C41594e9aDeCcf8c85ba9EEe0138C7c9E70dBc`
- **AgentRegistry**: `0xc4d732199b7d21207a74cfe6ced4d17dd330c7ea`
- **VerificationManager**: `0x34d156d6c062804771652b48f2d65d58d3794113`

---

## 1. AgentRegistry Contract
The `AgentRegistry` contract acts as the decentralized directory for AI Agents participating in the Proof-of-Reality network. 

### Core Features:
- **Agent Identity:** Stores the `agentId`, `name` (e.g., "Sentinel", "Tempest"), `role` (e.g., "Lead Investigator", "Environmental Analyst"), and the associated `wallet` address representing the agent on-chain.
- **Reputation Tracking:** Maintains a `reputation` score for each agent. Agents with higher reputation scores carry more weight in the consensus engine.
- **Active Status:** Tracks whether an agent is `isActive`, preventing deactivated or compromised agents from participating in new verification cases.

### Key Functions:
- `registerAgent`: Registers a new AI agent onto the protocol and emits an `AgentRegistered` event.
- `updateReputation`: Allows authorized actors to update the reputation score of an active agent based on their performance in recent cases.

---

## 2. VerificationManager Contract
The `VerificationManager` acts as the orchestration layer for the multi-agent consensus process on-chain. It coordinates the lifecycle of a verification case from inception to resolution.

### Core Features:
- **Case Lifecycle:** Tracks cases through various statuses: `Open`, `InProgress`, `Resolved`, and `Closed`.
- **Agent Assignment:** Integrates directly with the `AgentRegistry` to ensure that only valid, active agents are assigned to a verification case.
- **Result Anchoring:** Stores the final result of the verification process permanently on-chain.

### Key Functions:
- `createCase`: Initializes a new verification case with a specific description or asset identifier.
- `assignAgent`: Assigns an active agent from the `AgentRegistry` to an open case, moving the case status to `InProgress`.
- `resolveCase`: Finalizes the case by recording the final result string (or evidence hash) and marking the status as `Resolved`.

---

## 3. TruthCertificateNFT Contract
The final verification mints a **Truth Certificate NFT** on the Mantle network, acting as an immutable proof of consensus.

### Metadata Encoded:
- Verification timestamp
- Consensus score
- Participating agents
- Evidence hashes
- Confidence decay timer

### Dynamic Truth Decay (ERC-8004 Inspired)
Truth expires gradually. Confidence decays over time as real-world conditions evolve, necessitating re-evaluation by the agents. The `applyTruthDecay` function programmatically reduces the `consensusScore` if the decay timer has lapsed, prompting downstream protocols (like DeFi lenders) to request a fresh verification.
