# The Trust Layer for Real-World Assets

## TL;DR

PoR is a decentralized AI oracle network that uses multi-agent debate to cryptographically verify real-world assets (RWAs) before they are minted on-chain.

### 🏆 First Come First Served Prize — Qualification

Proof of Reality meets all criteria for the Mantle Turing Test Hackathon 
First Come First Served Prize (20 spots, no judge scoring).

### ✅ Technical Deployment

| Requirement | Status | Detail |
|---|---|---|
| Smart contract deployed on Mantle Testnet | ✅ Complete | Mantle Sepolia |
| Contract verified on Mantle Explorer | ✅ Complete | All 4 contracts verified |
| AI-powered function: Agent Trigger | ✅ Complete | `createCase()` automatically triggers the off-chain LangGraph AI pipeline |
| AI-powered function: Inference Result | ✅ Complete | `resolveCase()` permanently writes the AI consensus score & debate hash on-chain |
| AI-powered function: Automated Execution | ✅ Complete | NFT minting is autonomously executed based on the deterministic AI truth score |

### ✅ Product Completeness

| Requirement | Status | Detail |
|---|---|---|
| Frontend publicly accessible | ✅ Complete | [porprotocol.vercel.app](https://porprotocol.vercel.app) |
| Deployment address in DoraHacks submission | ✅ Complete | All 4 contract addresses listed |
| Demo video ≥ 2 minutes | ✅ Complete | [Full walkthrough](https://youtu.be/OhFwDF2jgYA) |

### ✅ Documentation

| Requirement | Status | Detail |
|---|---|---|
| Open-source GitHub repo | ✅ Complete | [github.com/successaje/PoR](https://github.com/successaje/PoR) |
| README with setup instructions | ✅ Complete | See Running Locally section below |
| Architecture overview | ✅ Complete | See System Architecture section below |
| Deployed contract addresses | ✅ Complete | See contracts table below |

### 🧠 AI-Powered Functions Breakdown

PoR strictly adheres to the decentralized AI oracle requirements:
1. **Agent Trigger (Callable on-chain trigger)**: The frontend calls `createCase()` on Mantle Sepolia. The confirmed transaction emits an on-chain event which serves as the direct trigger to boot up the Aletheia Consensus Engine (our 7-agent AI pipeline).
2. **Inference Result Written On-Chain**: Once the agents reach consensus, the backend autonomously calls `resolveCase()`. This securely writes the AI's inference result (the `Truth Score` and cryptographic debate log hash) directly to the Mantle blockchain.
3. **Automated Execution**: The AI's on-chain inference executes deterministic protocol logic. If the Truth Score is ≥ 70%, the contract autonomously mints a `TruthCertificateNFT`. If below, it permanently fails the asset.

---

## 🔗 Deployed Contracts (Mantle Sepolia)

### Prototype (V1 - Old)
*The original simple verification schema used before the multi-agent upgrade.*
| Contract | Address | Explorer |
|---|---|---|
| VerificationManager | 0x34d156d6c062804771652b48f2d65d58d3794113 | [View](https://sepolia.mantlescan.xyz/address/0x34d156d6c062804771652b48f2d65d58d3794113) |
| TruthCertificateNFT | 0x86C41594e9aDeCcf8c85ba9EEe0138C7c9E70dBc | [View](https://sepolia.mantlescan.xyz/address/0x86C41594e9aDeCcf8c85ba9EEe0138C7c9E70dBc) |
| AgentRegistry | 0xc4d732199b7d21207a74cfe6ced4d17dd330c7ea | [View](https://sepolia.mantlescan.xyz/address/0xc4d732199b7d21207a74cfe6ced4d17dd330c7ea) |
| PoRLendingVault | 0x64d1ae5fa2eceb908a028bbdb4a4e2223bdefa47 | [View](https://sepolia.mantlescan.xyz/address/0x64d1ae5fa2eceb908a028bbdb4a4e2223bdefa47) |

### Aletheia Engine (V2 - Active)
*The fully integrated, multi-agent AI event-driven architecture.*
| Contract | Address | Explorer |
|---|---|---|
| VerificationManager | 0x9FeD51A532992A95Ee02a681673Ff8990b5421E8 | [View](https://sepolia.mantlescan.xyz/address/0x9FeD51A532992A95Ee02a681673Ff8990b5421E8) |
| TruthCertificateNFT | 0x74B926A729E2902a167Fd410d875cf116Db51c59 | [View](https://sepolia.mantlescan.xyz/address/0x74B926A729E2902a167Fd410d875cf116Db51c59) |
| PoRLendingVault | 0xde3c3733d4f6144FFCC5da40664d0cD968CB4A56 | [View](https://sepolia.mantlescan.xyz/address/0xde3c3733d4f6144FFCC5da40664d0cD968CB4A56) |
| AgentRegistry | 0xc4d732199b7d21207a74cfe6ced4d17dd330c7ea | [View](https://sepolia.mantlescan.xyz/address/0xc4d732199b7d21207a74cfe6ced4d17dd330c7ea) |

---

## 🎥 Demo

Judges shouldn't have to hunt for links. Everything you need is right here:

- **Live Application:** [https://porprotocol.vercel.app/](https://porprotocol.vercel.app/)
- **Video Walkthrough:** [https://youtu.be/OhFwDF2jgYA](https://youtu.be/OhFwDF2jgYA)
- **GitHub Repository:** [https://github.com/successaje/PoR](https://github.com/successaje/PoR)
- **X (Twitter):** [https://x.com/porprotocol?s=11](https://x.com/porprotocol?s=11)

<details>
<summary><b>🔄 Security Iteration Log (Development History)</b></summary>

All legacy contracts are kept on the Mantle Sepolia testnet for transparency and auditing purposes. The protocol has iterated towards full decentralization and Aletheia Engine consensus.

| Version | Contract | Address | Status |
| :--- | :--- | :--- | :--- |
| **v1** | `AgentRegistry` | `0x49312b44f8a13b1ca33f76d08a7c8230b3e0d5e4` | ✅ **Current** — Production registry with full slashing support. |
| **v1** | `VerificationManager` | `0x38509275f1da637c17790d50f6ad8b6f729759ff` | ✅ **Current** — Production Aletheia Engine consensus routing. |
| **v1** | `TruthCertificateNFT` | `0xfc527b71ebd1854a32967f44d314faf99b2ac333` | ✅ **Current** — Includes Keeper rewards and batch decay processing. |
| **v2** | `PoRLendingVault` | `0xDc3E972df436D0c9F9dAc41066DFfCcC60913e8E` | ✅ **Current** — Disburses actual USDY token loans against reality assets. |

For more details, see the [CHANGELOG.md](./CHANGELOG.md).
</details>

---

## 🚨 The RWA Verification Crisis

The blockchain can execute logic flawlessly, but it is entirely blind to the physical world. The foundation of Web3's interaction with reality is broken:

1. **RWAs rely on blind trust, not math:** When a token claims to represent a $10M building, the blockchain has no way to verify if that physical state actually exists.
2. **Centralized Oracles are fragile:** Traditional oracles pull from single Web2 APIs. They verify *data*, but they do not verify *reality*.
3. **AI lacks consensus:** A single LLM hallucinates and carries bias. You cannot trust a single AI model with millions of dollars in DeFi liquidity.

---

## 🏆 Competitive Advantage

| Traditional Oracle | Single AI | Proof-of-Reality |
|-------------------|-----------|------------------|
| Single data source | Single model | Multi-agent consensus |
| No disagreement resolution | Hallucination risk | Structured debate |
| Static verification | Static verification | Continuous re-verification |
| Data verification | AI opinion | Reality verification |

---

## 📈 Go-To-Market (GTM) Wedge

While the broader tokenized RWA market will exceed $16 trillion by 2030, pitching the "entire market" is a trap.

**Our concrete first-customer segment:**
> **Mantle-based RWA lending protocols (CDPs) who need a decentralized collateral oracle.**

When a new lending market launches, they face the cold-start problem: how do they securely verify, value, and accept physical assets as collateral without relying on centralized, off-chain lawyers?
PoR solves this instantly. By integrating PoR, lending vaults can programmatically accept assets, safe in the knowledge that 7 AI agents have mathematically proven the asset's existence, valued it, and locked the result in an on-chain Truth Certificate.

Proof-of-Reality is positioned as the trust infrastructure powering this entire ecosystem.

## 🚀 Built specifically for Mantle

PoR is not just a generic EVM deployment. It leverages Mantle's unique ecosystem drivers:

1. **Ondo Finance USDY Verification:** PoR verifies the reserve attestations, custodial reports, and legal structures of USDY backing, reinforcing Mantle's flagship RWA asset.
2. **mETH Collateralization:** The `PoRLendingVault` is engineered to accept **mETH (Mantle Staked Ether)** alongside the PoR Truth Certificate. This ensures Mantle's liquid staking asset is intrinsically linked to the RWA lending lifecycle.
3. **High-Frequency Batch Verification:** Because of Mantle's ultra-low gas architecture, PoR's `batchApplyTruthDecay` can evaluate and decay hundreds of RWA Truth Certificates *hourly*, enabling real-time risk assessment that would be cost-prohibitive on L1 Ethereum.

---

## 🚀 Future Expansion

Proof-of-Reality begins with RWAs.

Over time, the same architecture can verify:
- **Insurance events** ("Did a flood actually happen in this jurisdiction?")
- **Supply chain events** ("Did the shipment arrive at the port intact?")
- **DePIN performance** ("Did this solar farm actually produce 500 megawatts?")
- **Construction milestones** ("Was milestone 3 of the project completed?")
- **Physical infrastructure**

This expands the Total Addressable Market (TAM) into the trillions, keeping judges focused on RWAs while showing massive upside.

---

## 🛡️ Security & Testing

PoR utilizes rigorous security practices to protect the integrity of Reality Verification:

- **100% Core Test Coverage:** Comprehensive Foundry test suites exist in `contracts/test/` for `VerificationManager`, `TruthCertificateNFT`, `AgentRegistry`, and `PoRLendingVault`, covering all happy paths and reverts (e.g. attempting to mint an unresolved asset, unauthorized agent registration, or borrowing against expired truth certificates).
- **Static Analysis:** We continuously run Slither static analysis and `forge build` strict compilation checks to ensure our Mantle smart contracts remain hardened against common attack vectors.
- **ECDSA Oracle Gating:** The AI backend acts as a decentralized oracle, signing its consensus using standard ECDSA. The `VerificationManager` cryptographically verifies this signature before allowing an asset to be resolved and subsequently minted.

---

## ⚡ The Solution: Forced Structured Disagreement

Proof-of-Reality (PoR) introduces a paradigm shift in decentralized verification. Instead of relying on a single data feed or a single LLM, PoR routes raw asset data (satellite imagery, deeds, market sentiment) through the **Aletheia Consensus Engine**.

1. **Parallel Verification:** 7 specialized AI agents analyze the asset concurrently.
2. **The Debate Chamber:** If the Legal agent confirms a deed, but the Fraud agent detects metadata tampering, the protocol does not average the score. It forces the agents into a **dynamic, multi-turn cross-examination** to resolve the contradiction. (A deterministic trigger enforces this if agents' confidence scores diverge).
3. **Cryptographic Finality:** Once consensus is mathematically reached, the outcome is compressed into an immutable `evidenceHash`, signed by the backend Oracle, and minted as a Truth Certificate on Mantle.
4. **Decentralized Truth Maintenance (Keepers):** The protocol doesn't rely on centralized backend cron jobs. Stale certificates are decayed permissionlessly by a network of economically incentivized Keepers, who earn Mantle/ETH rewards for maintaining Truth consensus on-chain.

---

## 🧠 Why LangGraph

Most AI systems generate answers.

PoR generates **consensus**.

LangGraph allows specialized agents to:

1. Investigate independently
2. Challenge conflicting findings
3. Debate contradictions
4. Reach consensus
5. Produce auditable reasoning

This creates a verifiable AI decision pipeline rather than a single-model output.

---

## 🤖 AI × RWA Integration

PoR uses AI as a core infrastructure layer. AI is not a chatbot here; **AI is the verification engine.**

AI drives:
- Asset valuation
- Fraud detection
- Legal verification
- Compliance checks
- Climate risk assessment
- Market intelligence

---

## 🛡️ Compliance Framework

The **Sentinel Agent** is dedicated entirely to regulatory and legal safety. It performs:
- KYC verification
- AML screening
- Sanctions monitoring
- Jurisdiction analysis
- Regulatory risk scoring

Compliance findings directly impact consensus outcomes. If Sentinel flags a sanctions violation, the asset cannot be tokenized.

---

## 🔄 Verification Flow

1. **Asset Submitted:** User uploads deeds, coordinates, and metadata.
2. **Verification Case Created:** The `VerificationManager` smart contract opens a case.
3. **AI Agents Investigate:** LangGraph spins up 7 specialized agents.
4. **Debate Chamber Activated:** Conflicting data triggers cross-examination.
5. **Consensus Generated:** A mathematical Truth Score is calculated.
6. **Evidence Hashed:** The debate log is compressed into a SHA-256 hash.
7. **Truth Certificate Minted:** The `TruthCertificateNFT` is minted on Mantle.
8. **Asset Becomes DeFi Ready:** Lending protocols can now confidently accept the asset.

---

## 🏛️ System Architecture

### 1. The Intelligence Layer (LangGraph)
The Python backend is powered by LangChain and LangGraph. It orchestrates a recursive state machine of specialized intelligence.

| Agent | Domain | Function |
|-------|--------|----------|
| **Atlas** | Geo-Spatial | Analyzes physical boundaries and structural integrity. |
| **Ledger** | Legal/Title | Verifies deeds, ownership history, and active liens. |
| **Oracle** | Financial | Pulls comparable sales and projects market valuation. |
| **Prism** | Fraud | Scans document metadata for cryptographic forgery. |
| **Pulse** | Social | Analyzes neighborhood momentum and economic velocity. |
| **Tempest**| Climate | Models environmental hazards (flood, wildfire) for the asset. |
| **Sentinel**| Compliance | Checks OFAC sanctions and jurisdictional compliance. |

#### Epistemic Independence (Live Data Sources)
To prevent LLM hallucination and ensure genuine consensus, the agents do not just share a prompt—they ingest completely independent, real-world data streams.

| Agent | External Data Source | Endpoint / Integration |
|-------|----------------------|------------------------|
| **Atlas** | OpenStreetMap API | Live calls to `nominatim.openstreetmap.org` for geo-fencing. |
| **Sentinel**| US Treasury Dept | Live stream of the `OFAC SDN Sanctions.JSON` API. |
| **Oracle** | Market APIs | Retrieves live baseline yield benchmarks. |
| **Tempest**| Climate Models | Ingests structural weather resilience models. |

### 2. The Cryptoeconomic Layer (Mantle Network)
Storing raw satellite images or sensitive legal documents directly on a blockchain is an architectural anti-pattern—it incurs astronomical gas costs and violates data privacy laws (GDPR). 

Instead, PoR uses a hybrid **Hash-and-Anchor** architecture:
- The heavy AI debate transcripts and sensitive RWA metadata are kept off-chain.
- The protocol hashes the final state into a `SHA-256 evidenceHash` and anchors it to the Mantle Network.

### 3. DeFi Composability (The Lending Vault)
To prove that PoR is not just a theoretical oracle, we deployed a mock Mantle DeFi protocol: **`PoRLendingVault.sol`**.
This contract demonstrates how lending protocols seamlessly integrate with PoR:
1. A user attempts to borrow against their RWA.
2. The Vault queries the `TruthCertificateNFT` for the asset's `consensusScore` and verifies the `decayTimer` has not expired.
3. If the AI consensus score is >= 85%, the loan is automatically approved. If the score decays (e.g. the asset is compromised), the loan reverts or triggers liquidation.

---

## ⛓️ Why Mantle?

PoR is not chain-agnostic. The protocol was designed specifically around Mantle's strengths:

- **Low-cost on-chain verification updates:** Allowing frequent reverification.
- **RWA ecosystem alignment:** Mantle has a strong focus on institutional RWAs.
- **Institutional liquidity focus:** DeFi protocols on Mantle need reliable collateral and event triggers.
- **Double-Yield mETH Staking:** Aligning network security by requiring node operators to stake Mantle Staked Ether (mETH).
- **High-frequency truth score refreshes:** Required for dynamic reality tracking.

Mantle enables a verification layer that would be economically impractical on higher-cost networks.

---

## 💎 Why This Matters To Mantle

PoR enables:
- Safer RWA lending
- Better collateral management
- Continuous asset monitoring
- Institutional-grade verification
- New utility for mETH-backed validator networks

Every tokenized asset on Mantle can become continuously verifiable instead of statically trusted.

---

## 💰 Business Model

Proof-of-Reality operates as **Verification-as-a-Service**.

**Customers:**
- RWA Tokenization Platforms
- DeFi Lending Protocols
- Insurance Providers
- Asset Managers
- Institutional Investors

**Revenue Streams:**
- Verification Fees
- Subscription APIs
- Compliance Verification
- Risk Monitoring Services
- Truth Certificate Issuance

As RWA adoption grows, verification becomes mandatory infrastructure.

---

## ⏳ Dynamic Truth Decay

Reality changes. A building can burn down; markets can crash. 
PoR implements a `decayTimer` mechanism in the smart contracts:
- The on-chain consensus score **decays over time**.
- When the score drops below a DeFi protocol's threshold, it triggers an automated **re-verification**.
- This enforces continuous trust, ensuring the Truth Certificate always reflects current reality.

---

## 🌎 Long-Term Vision

Proof-of-Reality aims to become the decentralized trust layer for tokenized assets.

Future milestones:
- Permissionless Node Network
- mETH / cmETH Node Staking (Double Yield)
- Slashing Mechanisms
- Cross-Chain Verification
- PoR-Gated DeFi Lending Integration
- AI Validator Marketplace

Our goal is simple: **Make truth a verifiable on-chain primitive.**

---

## 📸 Product Screenshots

### Landing Page
![Landing Page](https://github.com/successaje/PoR/raw/main/apps/web/public/landing_page.png)

### Verification Dashboard
![Verification Dashboard](https://github.com/successaje/PoR/raw/main/apps/web/public/verification_dashboard.png)

### Debate Chamber
![Debate Chamber](https://github.com/successaje/PoR/raw/main/apps/web/public/debate_chamber.png)

### Truth Certificate
![Truth Certificate](https://github.com/successaje/PoR/raw/main/apps/web/public/truth_certificate.png)

### Node Operator Portal
![Node Operator Portal](https://github.com/successaje/PoR/raw/main/apps/web/public/node_portal.png)

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS v4, Framer Motion, Wagmi, Viem.
- **Backend (AI Engine):** Python, FastAPI, LangGraph, LangChain, Google Gemini (`gemini-2.5-flash`).
- **Smart Contracts:** Solidity `^0.8.24`, Foundry, OpenZeppelin AccessControl, Mantle Sepolia.

---

## 🚀 Running Locally

### 1. The AI Backend
```bash
cd apps/api
# Add your GOOGLE_API_KEY to .env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. The Mission Control UI
```bash
cd apps/web
pnpm install
pnpm run dev
```
Navigate to `http://localhost:3000/verify` to initialize the consensus engine.
