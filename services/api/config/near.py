from near_api import Client
import os
import json

class NearContract:
    def __init__(self):
        self.network_id = os.getenv("NEAR_NETWORK_ID", "mainnet")
        self.node_url = os.getenv("NEAR_NODE_URL", "https://rpc.mainnet.near.org")
        self.account_id = os.getenv("NEAR_ACCOUNT_ID")
        self.contract_id = os.getenv("NEAR_CONTRACT_ID", "verity_anchor.near")
        self.private_key = os.getenv("NEAR_PRIVATE_KEY")
        
        if not all([self.account_id, self.private_key]):
            raise ValueError("Missing NEAR credentials")
        
        self.client = Client(self.node_url)
        self.account = self.client.account(self.account_id)
    
    async def anchor(self, anchor_id: str, commitment_hash: str, metadata: str = None):
        """Anchor a commitment hash to the blockchain"""
        try:
            result = await self.account.function_call(
                self.contract_id,
                "anchor",
                {
                    "anchor_id": anchor_id,
                    "commitment_hash": commitment_hash,
                    "metadata": metadata
                },
                gas=30000000000000,
                attached_deposit=100000000000000000000000  # 0.1 NEAR
            )
            return result
        except Exception as e:
            raise Exception(f"Failed to anchor: {str(e)}")
    
    async def get_anchor(self, anchor_id: str):
        """Get anchor data from blockchain"""
        try:
            result = await self.account.view_function(
                self.contract_id,
                "get_anchor",
                {"anchor_id": anchor_id}
            )
            return result
        except Exception as e:
            raise Exception(f"Failed to get anchor: {str(e)}")
    
    async def verify(self, anchor_id: str, commitment_hash: str):
        """Verify a commitment hash"""
        try:
            result = await self.account.view_function(
                self.contract_id,
                "verify",
                {
                    "anchor_id": anchor_id,
                    "commitment_hash": commitment_hash
                }
            )
            return result
        except Exception as e:
            raise Exception(f"Failed to verify: {str(e)}")

# Global contract instance
near_contract = None

async def get_near_contract():
    global near_contract
    if near_contract is None:
        near_contract = NearContract()
    return near_contract
