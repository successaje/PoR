# Changelog & Security Iteration Log

## Smart Contract Development History

All legacy contracts are kept on the Mantle Sepolia testnet for transparency and auditing purposes.

| Version | Contract | Address | Status |
| :--- | :--- | :--- | :--- |
| **v1** | `TruthCertificateNFT` | `0x6444f16e29bf33a8c9da2b89e472b58bafe41b9c` | ⚠️ **Deprecated** — Initial test, `onlyOwner` mint restriction. |
| **v2** | `TruthCertificateNFT` | `0xf673f508104876c72c8724728f81d50e01649b40` | ⚠️ **Deprecated** — Mint was permissionless, no consensus gate. |
| **v3** | `TruthCertificateNFT` | `0xfc527b71ebd1854a32967f44d314faf99b2ac333` | ⚠️ **Deprecated** — Mint gated by `VerificationManager`, no Keeper rewards. |
| **v4** | `TruthCertificateNFT` | `0x47f4917805C577a168d411b4531F2A49fBeF311e` | ✅ **Current** — Includes Keeper rewards and batch decay processing. |
| **v1** | `VerificationManager` | `0x7cc324d15e5ff17c43188fb63b462b9a79da68f6` | ⚠️ **Deprecated** — Lacked signature threshold and agent weights. |
| **v2** | `VerificationManager` | `0x38509275f1da637c17790d50f6ad8b6f729759ff` | ⚠️ **Deprecated** — Initial Aletheia Engine consensus. |
| **v3** | `VerificationManager` | `0x5467EB13A408C48EB02811E92968F6e2A2556040` | ✅ **Current** — Production Aletheia Engine consensus routing. |
| **v1** | `AgentRegistry` | `0x7dc16d44789283279b28c940359011f2649897da` | ⚠️ **Deprecated** — Basic mapping, no slashing logic. |
| **v2** | `AgentRegistry` | `0x49312b44f8a13b1ca33f76d08a7c8230b3e0d5e4` | ⚠️ **Deprecated** — Stake-weighted registration. |
| **v3** | `AgentRegistry` | `0xfF026fC25E1c2E7A70F3A6a0Bc14993Df3DA1d8B` | ✅ **Current** — Production registry with full slashing support. |
| **v1** | `PoRLendingVault` | `0x64d1ae5fa2eceb908a028bbdb4a4e2223bdefa47` | ⚠️ **Deprecated** — Disburses USDY against `mETH` + NFT collateral (transfer logic commented). |
| **v2** | `PoRLendingVault` | `0xDc3E972df436D0c9F9dAc41066DFfCcC60913e8E` | ✅ **Current** — Disburses actual USDY token loans against reality assets. |
