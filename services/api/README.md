# API Service — Placeholder

Draft of public API endpoints used by the mini app and other clients.

## Proposed Endpoints

- POST `/v1/anchors`
  - Body: `{ anchorId, commitmentHash, metadata? }`
  - Action: Submit anchor on-chain (NEAR) and persist reference.
  - Returns: `{ anchorId, txHash, contractAddress }`

- GET `/v1/anchors/{anchorId}`
  - Action: Fetch anchor record (off-chain cache + on-chain confirmation).
  - Returns: `{ anchorId, commitmentHash, timestamp, creator, revoked? }`

- POST `/v1/verify`
  - Body: `{ anchorId, commitmentHash }`
  - Action: Check commitment against on-chain record.
  - Returns: `{ anchorId, verified: true|false }`

- GET `/health`
  - Action: Liveness/readiness probe.
  - Returns: `{ status: "ok" }`

## Notes

- AuthN/Z TBD; may require API keys or OAuth depending on deployment.
- Rate limiting and audit logging recommended.

