# NEAR Contract: anchor_proof (Concept)

Concept for a NEAR smart contract to anchor cryptographic proofs for media authenticity.

## Problem

Clients need a tamper-evident registry that records immutable commitments (hashes) of media/proofs and allows public verification.

## Contract Idea

- Store a mapping from `anchor_id` to an `AnchorRecord`:
  - `anchor_id`: string/bytes (e.g., UUID or content-derived ID)
  - `commitment_hash`: bytes (hash of media/proof bundle, e.g., SHA-256 or Poseidon)
  - `timestamp`: block timestamp
  - `creator`: account ID that created the anchor
  - optional `metadata`: JSON string (bounded size)

## Core Methods

- `anchor(anchor_id, commitment_hash, metadata?)`:
  - Fails if `anchor_id` already exists.
  - Emits event `anchor_created` with `anchor_id` and `commitment_hash`.
- `get_anchor(anchor_id) -> AnchorRecord | null`:
  - Read-only lookup.
- `verify(anchor_id, commitment_hash) -> bool`:
  - Returns true if stored `commitment_hash` matches input.
- `revoke(anchor_id)` (optional):
  - Marks record as revoked; keeps history.

## Events

- `anchor_created(anchor_id, commitment_hash, creator, timestamp)`
- `anchor_revoked(anchor_id, creator, timestamp)` (if revoke supported)

## Security & Gas Considerations

- Bound metadata size; prefer off-chain storage for large data.
- Use deterministic hashing of the media/proof bundle off-chain.
- Access control: anyone can read; write restricted by caller and possibly fees.
- Consider storage staking and refund patterns per NEAR standards.

## Next

- Choose contract language (Rust near-sdk or JS near-sdk-js).
- Define exact serialization formats and hashing scheme.
- Implement unit/integration tests and deploy to testnet.

