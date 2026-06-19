# 🪙 Proof-of-Reality (PoR) Tokenomics & Unit Economics

The PoR protocol is designed to be economically self-sustaining from day one. Rather than relying solely on token emission inflation, the network is driven by real-world verification demand.

## 📊 Unit Economics (Per Case Verification)

When an institutional lender or asset issuer requests a Reality Verification through the `VerificationManager` contract, they pay a **Verification Fee** in stablecoins (e.g., USDY) or $POR.

**Example Case: Verifying a $5M Commercial Property for Collateralization**
- **Total Verification Fee:** $50.00
- **Total Protocol Margin:** $45.00 (90% Gross Margin)

### Fee Distribution Split
Once consensus is reached and the `TruthCertificateNFT` is minted, the $50 fee is trustlessly routed via smart contracts:

1. **AI Inference & API Costs ($5.00 | 10%)**
   - Covers the raw LLM inference costs (OpenAI, Anthropic) and premium Web2 API calls (satellite imagery, localized property databases) required by the 7 Aletheia agents.
2. **Node Operator Rewards ($35.00 | 70%)**
   - Paid out to the decentralized network of Node Operators running the AI Agents. 
   - Distributed proportionally based on agent participation and historical accuracy in the Debate Chamber.
3. **Protocol Treasury ($10.00 | 20%)**
   - Captured by the PoR Protocol Treasury.
   - Used for continuous $POR buyback-and-burn mechanisms and protocol development.

---

## 🔒 The Planned $POR Utility Token

*(Note: For the hackathon MVP, keeper rewards and fees are currently denominated in native Mantle `$MNT` and `USDY` to prove the cryptoeconomic mechanism works. `$POR` is the planned future utility token.)*

The planned `$POR` token will secure the network, aligning the incentives of Node Operators, Asset Owners, and the Protocol.

### 1. Agent Staking & Slashing
To become a recognized Node Operator in the `AgentRegistry`, operators must stake $POR.
- If an agent contributes valuable, mathematically sound evidence to the Debate Chamber, their stake earns yield from the Verification Fees.
- If an agent hallucinates, attempts to inject fraudulent data, or acts maliciously, the Aletheia Consensus Engine flags them during cross-examination, and their **$POR stake is slashed**.

### 2. Fee Discounts & Payment
While protocols can pay Verification Fees in USDY, paying in $POR grants a 15% discount, driving constant buy-pressure from institutional integrators (e.g., RWA Lending Vaults).

### 3. Governance
$POR holders govern the protocol parameters:
- Setting the base Verification Fee.
- Approving new Agent specializations (e.g., adding a new "Carbon Credit Verifier" agent).
- Adjusting the fee distribution split.

---

## 📈 Financial Projections (Mantle Network)

Because Mantle's ultra-low gas fees enable **Batch Verification**, PoR can process thousands of verifications concurrently. 

Assuming our primary Go-To-Market wedge (Mantle CDP protocols) generates just **1,000 verifications per day**:
- **Daily Revenue:** $50,000
- **Daily Operator Payout:** $35,000
- **Daily Treasury Capture:** $10,000
- **Annualized Treasury Revenue:** $3.65 Million
