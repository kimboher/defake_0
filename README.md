



# Defake — Defakes is a gamified Truth Protocol that crowdsources deepfake detection via a viral Telegram prediction market, anchoring forensic chain-of-custody on Base.

live demo https://youtube.com/shorts/tCVrBi8PjH0

<img width="423" height="688" alt="Screenshot 2025-12-14 080724" src="https://github.com/user-attachments/assets/ce5031a0-8128-43f7-8a92-b1880b827dd3" />
<img width="415" height="693" alt="Screenshot 2025-12-14 080736" src="https://github.com/user-attachments/assets/b6014ece-c59e-4ceb-bd07-b9085edcc534" />
<img width="411" height="691" alt="Screenshot 2025-12-14 080751" src="https://github.com/user-attachments/assets/56ec6c24-4ff2-4a44-92ce-130e48fa30ed" />




> **Mission.** Help insurers adapt to the AI era by turning fragile media into **private, provable, audit-ready evidence**, stopping deepfake/tampering fraud (>$200B/yr), preventing **duplicate claims across carriers without sharing PII**, and making claim submission **effortless** via a conversational agent.

## Problem
- Conventional photo/video/voice evidence is no longer ground truth as generative AI proliferates.
- Historically ~10% of P&C claims are undetected fraud (~$60B/yr). With synthetic/tampered media, leakage may exceed **$200B/yr**.
- Carriers operate in silos, making duplicate-claim detection slow, manual, and privacy-risky.

## What Defake Delivers
- **Authenticity:** Media hashing + Merkle roots + blockchain anchoring (NEAR). No raw media or PII on-chain.
- **Duplicate-claim defense:** Cross-carrier comparison via **hash-only** registries/APIs—no claimant data exchange.
- **Zero-friction claims:** DFIC, a 24/7 conversational agent that guides customers step by step and ensures complete submissions.

## Agent Architecture (simple view)
- Guidance Agent — Conversational bot to collect claim info, guide uploads, and provide emergency support.

-Verification Agent — Hashes and checks uploaded media with ML; outputs proof_id, merkle_root, and a NEAR-anchored receipt.

-Privacy Agent — Runs inside Shade/TEE; ensures sensitive data never leaks.

-Duplicate Check Agent — Detects reused media across claims; later extended via NEAR Intents.

-Adjuster Copilot — Summarizes evidence, flags anomalies, and links proofs for insurer staff.

## Minimal Artifacts
- **On-chain (NEAR):** `{proof_id, merkle_root, media_sha256, policy_hash, method_version}`
- **Off-chain (DB):** Claim JSON, checklist status, receipt JSON, reason codes, duplicate-match metadata
- **TEE:** Remote attestation for integrity and ML checks

## Privacy & Integrity Posture
- Raw media never on-chain; proofs only.
- Duplicate checks are hash-only; no PII exchange between carriers.
- Receipts bind outcomes to **specific method/policy versions** for auditability.
- Shade/TEE provides verifiable, sealed execution of ML checks and policy enforcement.
  
## Contract Features:
- anchor() - Store commitment hashes with metadata
- get_anchor() - Retrieve anchor records
- verify() - Verify commitment hashes
- Duplicate prevention - Can't anchor same ID twice
- Event logging - Emits anchor creation events
- Validation - Proper hash format checking
- Pagination - Get anchors by creator
- Full test suite included

## High-Level Roadmap 
1. **Foundations:** DFIC intake + Proof Receipts + Verify page; single-tenant duplicate checks.
2. **Attestation:** Media Integrity Agent + Policy Agent run inside Shade/TEE; receipts include attestation + model version.
3. **Cross-carrier:** Duplicate-claim Matching Agent extended with **NEAR Intents**; Adjuster Copilot live.
4. **Scale:** Rich ML deepfake detection models attested; Analytics Agent provides “Verified Analytics” dashboards.

## Contents

```
defake/
├── README.md
├── apps/
│   └── miniapp/
│       └── README.md
├── contracts/
│   └── near/
│       └── README.md
├── services/
│   └── api/
│       └── README.md
└── docs/
    └── architecture.md
```

















