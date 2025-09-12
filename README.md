



# Defake — Agentic Media Integrity for Insurance

<img width="1699" height="1275" alt="image" src="https://github.com/user-attachments/assets/f75f2c90-d54f-4de3-ab37-4a939c29c173" />
<img width="1704" height="593" alt="image" src="https://github.com/user-attachments/assets/e748a573-4b00-4fa4-a833-f9045798abaf" />
<img width="1694" height="1159" alt="image" src="https://github.com/user-attachments/assets/5dacd419-78c9-4e55-998a-815084df724b" />



> **Mission.** Help insurers adapt to the AI era by turning fragile media into **private, provable, audit-ready evidence**, stopping deepfake/tampering fraud (>$200B/yr), preventing **duplicate claims across carriers without sharing PII**, and making claim submission **effortless** via a conversational agent.

## Problem
- Conventional photo/video/voice evidence is no longer ground truth as generative AI proliferates.
- Historically ~10% of P&C claims are undetected fraud (~$60B/yr). With synthetic/tampered media, leakage may exceed **$200B/yr**.
- Carriers operate in silos, making duplicate-claim detection slow, manual, and privacy-risky.

## What Defake Delivers
- **Authenticity:** Media hashing + Merkle roots + blockchain anchoring (NEAR). No raw media or PII on-chain.
- **Duplicate-claim defense:** Cross-carrier comparison via **hash-only** registries/APIs—no claimant data exchange.
- **Zero-friction claims:** DFIC, a 24/7 conversational agent that guides customers step by step and ensures complete submissions.

## Agent Architecture (Responsibilities)
- **A0 · DFIC Guidance Agent** — Conversational intake; guides claimants; ensures completeness; multilingual.
- **A1 · Policy/Checklist Agent** — Expands insurer policy into a per-incident checklist; outputs `policy_hash` for audit; runs in **Shade/TEE** for sealed execution.
- **A2 · Evidence Capture Coach** — Guides capture of photos/videos; ensures usable evidence before submission.
- **A3 · Media Integrity Agent (Shade/TEE)** — Performs media hashing (SHA-256, Merkle root) and runs **ML integrity checks** for tampering/deepfakes inside a TEE; produces `method_version` + attestation.
- **A4 · Attestation & Anchor Agent** — Signs `{policy_hash, merkle_root, media_sha256, method_version}` and anchors it on **NEAR**; issues Proof Receipt (`proof_id`, `tx_hash`).
- **A5 · Duplicate-Claim Matching Agent** — Privacy-preserving cross-carrier hash registry; later extended via **NEAR Intents**.
- **A6 · Completeness Gate Agent** — Validates all checklist items + receipts are present; sends fixes back to Guidance Agent.
- **A7 · Claims Packager Agent** — Produces claim package (forms, receipts, NEAR tx links) for adjusters.
- **A8 · Adjuster Copilot** — Summarizes claim evidence, highlights anomalies, shows anchored receipts & attestations.
- **A9 · Public Verifier Agent** — Anyone can re-hash submitted media and check on-chain records → green/red + tx link.
- **A10 · Analytics & Risk Agent** — Aggregates fraud metrics (tamper detections, duplicates, pass/fail rates); can run in Shade/TEE with attested outputs.

## Minimal Artifacts
- **On-chain (NEAR):** `{proof_id, merkle_root, media_sha256, policy_hash, method_version}`
- **Off-chain (DB):** Claim JSON, checklist status, receipt JSON, reason codes, duplicate-match metadata
- **TEE (optional):** Remote attestation for integrity and ML checks

## Privacy & Integrity Posture
- Raw media never on-chain; proofs only.
- Duplicate checks are hash-only; no PII exchange between carriers.
- Receipts bind outcomes to **specific method/policy versions** for auditability.
- Shade/TEE provides verifiable, sealed execution of ML checks and policy enforcement.

## High-Level Roadmap (No Code)
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

## Getting Started

- See `apps/miniapp/README.md` for the Telegram/Web Mini App scaffold.
- See `contracts/near/README.md` for the `anchor_proof` contract concept.
- See `services/api/README.md` for draft API endpoints.
- See `docs/architecture.md` for the agent flow overview.

## Next Steps

- Fill in implementation details per component.
- Decide on deployment targets and CI.



