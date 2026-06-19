# Proof-of-Reality (PoR)

## The Trust Layer for Real-World Assets

Proof-of-Reality (PoR) is a decentralized AI consensus protocol built on Mantle Network that verifies real-world truth before assets are used on-chain.

As trillions of dollars in Real-World Assets (RWAs) move into blockchain ecosystems, trust remains the largest unsolved problem. Property records can be forged, valuations manipulated, ownership disputed, and compliance data fragmented across multiple sources.

PoR introduces a new primitive for Web3:

**Truth Oracles.**

Instead of relying on a single oracle or centralized verification provider, PoR deploys a network of specialized AI agents that independently investigate, challenge, and verify real-world information before producing a consensus-backed Truth Certificate on Mantle.

---

# The Problem

The RWA industry faces a fundamental challenge:

> Blockchains can tokenize assets, but they cannot verify reality.

Current verification systems rely on:

* Centralized data providers
* Manual auditing processes
* Single-source oracles
* Fragmented compliance systems
* Trust assumptions that cannot be independently verified

As a result:

* Fraudulent assets can enter the ecosystem
* Valuations can be manipulated
* Ownership claims can be disputed
* Lending protocols assume hidden risks
* Tokenized assets lose credibility

Without trusted verification, the future of RWAs remains constrained.

---

# The Solution

Proof-of-Reality creates a decentralized AI consensus network capable of independently verifying real-world assets.

Each verification request triggers a multi-agent intelligence process where specialized agents gather evidence, challenge conflicting findings, and collaboratively determine a final truth score.

The result is:

* Transparent verification
* Verifiable audit trails
* On-chain evidence anchoring
* Decentralized trust formation
* Composable Truth Certificates

---

# Core Innovation

## 1. Multi-Agent Verification

PoR uses specialized AI agents instead of a single model.

Each agent investigates a different dimension of reality.

| Agent    | Responsibility                      |
| -------- | ----------------------------------- |
| Atlas    | Geo-spatial verification            |
| Ledger   | Ownership and title verification    |
| Oracle   | Valuation and yield estimation      |
| Prism    | Fraud detection                     |
| Pulse    | Social and economic signals         |
| Tempest  | Climate and environmental risk      |
| Sentinel | Compliance and AML verification     |
| Aegis    | Arbitration and consensus formation |

This creates independent perspectives on the same asset.

---

## 2. The Debate Chamber

The most important innovation in PoR.

Traditional AI systems generate answers.

PoR generates disagreement.

When agents produce conflicting conclusions:

* Contradictions are detected
* Evidence is challenged
* Re-evaluation is triggered
* Confidence scores are updated

Aegis then orchestrates consensus formation.

Instead of trusting one model, PoR trusts structured debate.

---

## 3. Truth Certificates

After consensus is reached:

PoR generates:

* Truth Score
* Fraud Probability
* Risk Rating
* Valuation Estimate
* Evidence Hash

These outputs are recorded on Mantle and minted as Truth Certificates.

Truth becomes:

* Verifiable
* Auditable
* Transferable
* Composable

---

## 4. Truth Decay

Reality changes.

Buildings deteriorate.

Ownership changes.

Markets fluctuate.

Truth should not remain static forever.

PoR introduces Truth Decay.

Over time:

* confidence scores gradually decay
* re-verification becomes necessary
* stale information loses influence

This creates living verification infrastructure rather than one-time certification.

---

# How It Works

### Step 1

Asset submitted.

Example:

* Commercial Property
* Land Parcel
* Office Building
* Warehouse

---

### Step 2

Verification case created.

A unique case ID is generated.

---

### Step 3

Eight AI agents activate simultaneously.

Each agent independently gathers evidence.

---

### Step 4

The Debate Chamber begins.

Agents compare findings.

Conflicts trigger cross-examination.

---

### Step 5

Aegis computes final consensus.

Outputs:

* Truth Score
* Fraud Score
* Asset Valuation
* Risk Rating

---

### Step 6

Results are anchored on Mantle.

Evidence is hashed.

Truth Certificate NFT is minted.

---

# Strategic Ecosystem Integration: Mantle & Ondo Finance

PoR is designed specifically to strengthen Mantle's RWA ecosystem, leveraging its ultra-low gas architecture and strategic partnerships.

### 1. High-Frequency Batch Verification
Because of Mantle's gas efficiency, PoR can run `batchApplyTruthDecay()` across hundreds of Reality Assets hourly rather than monthly. This enables real-time dynamic pricing of physical assets, a feature that is economically prohibitive on L1 Ethereum.

### 2. Ondo Finance USDY (Highest Strategic Value)
Mantle has positioned **Ondo Finance USDY** as a flagship RWA asset in its ecosystem. USDY is backed by US Treasuries and bank deposits, where trust, transparency, and continuous verification are paramount.

**How PoR Enhances USDY on Mantle:**
Instead of relying solely on centralized issuer attestations, PoR's multi-agent system continuously verifies:
* Reserve attestations and custodial reports
* Treasury backing reports matching minted token supply
* Legal trust structures and SEC disclosures

### 3. mETH as Liquid Collateral
In the `PoRLendingVault`, users must supply **mETH (Mantle Staked Ether)** alongside their PoR Truth Certificate to unlock institutional liquidity (borrowing USDY). This embeds Mantle's native yield-bearing asset directly into the RWA lending lifecycle.

By combining **mETH**, **USDY**, and **PoR Verification**, Mantle achieves a complete, trust-minimized RWA stack.

### 4. Our Go-To-Market (GTM) Wedge
While the broader tokenized RWA market will exceed $16 trillion by 2030, pitching the "entire market" is a trap.

**Our concrete first-customer segment:**
> **Mantle-based RWA lending protocols (CDPs) who need a decentralized collateral oracle.**

When a new lending market launches, they face the cold-start problem: how do they securely verify, value, and accept physical assets as collateral without relying on centralized, off-chain lawyers?
By integrating PoR, Mantle CDP vaults can programmatically accept assets, safe in the knowledge that 7 AI agents have mathematically proven the asset's existence, valued it, and locked the result in an on-chain Truth Certificate.

---

# Why Mantle

Mantle is uniquely positioned to become the home of institutional-grade RWAs.

PoR increases the utility of Mantle by enabling:

* safer tokenization
* more reliable lending
* stronger compliance
* improved institutional confidence

Every verified asset creates permanent on-chain activity.

Every re-verification creates recurring ecosystem engagement.

---

# AI × RWA Track Alignment

PoR directly aligns with the AI & RWA track.

### Human Driven Infrastructure

AI-powered verification infrastructure for tokenized real-world assets.

### AI Driven Application

End-user verification system for asset owners, lenders, and investors.

### Asset Classes

* Real Estate
* Treasury Products
* Commodities
* Infrastructure Assets
* Future RWA Categories

---

# Agentic Economy Alignment

PoR introduces the foundation for a decentralized verification economy.

Future versions enable:

* Independent node operators
* Agent staking
* Reputation scoring
* Verification rewards
* Distributed intelligence networks

This transforms truth verification into an open economic system.

---

# DevTool Alignment

PoR can evolve into verification infrastructure for developers.

Future integrations:

* Verification APIs
* Truth Score SDK
* Risk Assessment APIs
* Compliance APIs
* Mantle-native verification tools

Developers can integrate PoR into their applications with a single API call.

---

# Consumer & Viral Potential

PoR creates an experience people immediately understand.

Users can watch:

* AI agents investigate
* disagreements emerge
* debates unfold
* consensus form in real time

The protocol turns verification into a transparent and engaging experience.

The Debate Chamber becomes a highly shareable product experience.

---

# Technical Architecture

Frontend

* Next.js
* React
* TailwindCSS
* Framer Motion
* Wagmi
* Viem

Backend

* FastAPI
* LangGraph
* LangChain
* OpenAI
* Multi-Agent Orchestration

Smart Contracts

* Solidity
* Foundry
* Mantle Network

Core Contracts & Deployed Addresses (Mantle Sepolia)

* **TruthCertificateNFT**: [`0x86C41594e9aDeCcf8c85ba9EEe0138C7c9E70dBc`](https://explorer.sepolia.mantle.xyz/address/0x86C41594e9aDeCcf8c85ba9EEe0138C7c9E70dBc)
* **AgentRegistry**: [`0xc4d732199b7d21207a74cfe6ced4d17dd330c7ea`](https://explorer.sepolia.mantle.xyz/address/0xc4d732199b7d21207a74cfe6ced4d17dd330c7ea)
* **VerificationManager**: [`0x34d156d6c062804771652b48f2d65d58d3794113`](https://explorer.sepolia.mantle.xyz/address/0x34d156d6c062804771652b48f2d65d58d3794113)

---

# Long-Term Vision

Today:

Price Oracles determine value.

Tomorrow:

Truth Oracles determine reality.

Proof-of-Reality is building the verification layer that allows blockchain systems to understand whether real-world information is accurate, trustworthy, and usable.

The future of RWAs does not depend solely on tokenization.

It depends on trust.

PoR is building that trust layer.


