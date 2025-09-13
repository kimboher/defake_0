from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config.near import get_near_contract
from config.supabase import supabase_client

router = APIRouter()

class VerifyRequest(BaseModel):
    anchor_id: str
    commitment_hash: str

@router.post("/")
async def verify_proof(request: VerifyRequest):
    """Verify a commitment hash against blockchain"""
    try:
        # Verify on blockchain
        near_contract = await get_near_contract()
        is_verified = await near_contract.verify(
            request.anchor_id,
            request.commitment_hash
        )
        
        # Get proof from database
        proof_result = supabase_client.table("proofs").select("*").eq(
            "anchor_id", request.anchor_id
        ).execute()
        
        proof = proof_result.data[0] if proof_result.data else None
        
        # Update verification status
        if proof:
            supabase_client.table("proofs").update({
                "verified": is_verified
            }).eq("id", proof["id"]).execute()
        
        return {
            "success": True,
            "data": {
                "verified": is_verified,
                "anchor_id": request.anchor_id,
                "commitment_hash": request.commitment_hash,
                "proof_id": proof["id"] if proof else None,
                "message": "Proof verified successfully" if is_verified else "Proof verification failed"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
