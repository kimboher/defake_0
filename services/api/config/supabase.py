from supabase import create_client, Client
import os
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_ANON_KEY")

if not url or not key:
    raise ValueError("Missing Supabase environment variables")

supabase_client: Client = create_client(url, key)

# Database models
class ClaimBase(BaseModel):
    user_id: str
    claim_type: str
    description: str
    file_hashes: List[str]
    metadata: Optional[dict] = None

class Claim(ClaimBase):
    id: str
    status: str = "pending"
    created_at: datetime
    updated_at: datetime

class ProofBase(BaseModel):
    claim_id: str
    anchor_id: str
    commitment_hash: str
    block_height: Optional[int] = None
    transaction_hash: Optional[str] = None
    verified: bool = False

class Proof(ProofBase):
    id: str
    created_at: datetime
