#!/bin/bash
set -e

# Build the contract
echo "🔨 Building Defake NEAR contract..."
cargo build --target wasm32-unknown-unknown --release

# Copy the wasm file
cp target/wasm32-unknown-unknown/release/defake_anchor.wasm ./defake_anchor.wasm

echo "✅ Contract built successfully!"
echo "📦 WASM file: ./defake_anchor.wasm"
echo ""
echo "🚀 To deploy:"
echo "near deploy --wasmFile defake_anchor.wasm --accountId your_account.near"
echo ""
echo "🔧 To initialize:"
echo "near call your_account.near new '{\"owner\": \"your_account.near\"}' --accountId your_account.near"
