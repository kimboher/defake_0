# Agent Flow (High-Level)

## Actors

- Client (Mini App / Web)
- API Service
- NEAR `anchor_proof` Contract
- Storage/DB (for off-chain references/metadata)

## Anchor Flow

1. Client computes commitment hash of media/proof bundle locally.
2. Client calls API `POST /v1/anchors` with `{ anchorId, commitmentHash, metadata? }`.
3. API submits `anchor(anchorId, commitmentHash, metadata?)` to NEAR.
4. Contract persists record and emits `anchor_created` event.
5. API stores off-chain metadata reference and returns `{ anchorId, txHash }` to client.

## Verification Flow

1. Client (or verifier) calls API `POST /v1/verify` with `{ anchorId, commitmentHash }`.
2. API reads on-chain record via RPC and compares `commitmentHash`.
3. API returns `{ verified: true|false }`.

## Notes

- Large assets are not stored on-chain; only commitments are anchored.
- Ensure deterministic hashing and document the exact bundle format.
- Extend with revocation or key-rotation if needed.
