from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List
import hashlib
import json
from datetime import datetime

from config.supabase import supabase_client, ClaimBase, ProofBase
from config.near import get_near_contract

router = APIRouter()

@router.post("/")
async def create_anchor(
    claim_type: str,
    description: str,
    metadata: str = "{}",
    files: List[UploadFile] = File(...)
):
    """Create a new anchor with file uploads"""
    try:
        if not files:
            raise HTTPException(status_code=400, detail="No files provided")
        
        # Generate file hashes
        file_hashes = []
        for file in files:
            content = await file.read()
            file_hash = hashlib.sha256(content).hexdigest()
            file_hashes.append(f"0x{file_hash}")
        
        # Generate commitment hash
        commitment_hash = hashlib.sha256(
            "".join(file_hashes).encode()
        ).hexdigest()
        commitment_hash_with_prefix = f"0x{commitment_hash}"
        
        # Generate unique anchor ID
        anchor_id = f"defake_{int(datetime.now().timestamp())}_{hashlib.sha256(commitment_hash.encode()).hexdigest()[:8]}"
        
        # Store claim in Supabase
        claim_data = ClaimBase(
            user_id="demo_user",
            claim_type=claim_type,
            description=description,
            file_hashes=file_hashes,
            metadata=json.loads(metadata)
        )
        
        claim_result = supabase_client.table("claims").insert(claim_data.dict()).execute()
        if not claim_result.data:
            raise HTTPException(status_code=500, detail="Failed to store claim")
        
        claim_id = claim_result.data[0]["id"]
        
        # Anchor to NEAR blockchain
        near_contract = await get_near_contract()
        anchor_result = await near_contract.anchor(
            anchor_id=anchor_id,
            commitment_hash=commitment_hash_with_prefix,
            metadata=json.dumps({
                "claim_id": claim_id,
                "claim_type": claim_type,
                "file_count": len(files),
                "timestamp": datetime.now().isoformat()
            })
        )
        
        # Store proof in Supabase
        proof_data = ProofBase(
            claim_id=claim_id,
            anchor_id=anchor_id,
            commitment_hash=commitment_hash_with_prefix,
            verified=True
        )
        
        proof_result = supabase_client.table("proofs").insert(proof_data.dict()).execute()
        if not proof_result.data:
            raise HTTPException(status_code=500, detail="Failed to store proof")
        
        # Update claim status
        supabase_client.table("claims").update({
            "status": "verified"
        }).eq("id", claim_id).execute()
        
        return {
            "success": True,
            "data": {
                "claim_id": claim_id,
                "anchor_id": anchor_id,
                "commitment_hash": commitment_hash_with_prefix,
                "file_hashes": file_hashes,
                "proof_id": proof_result.data[0]["id"],
                "message": "Claim anchored successfully to blockchain"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{anchor_id}")
async def get_anchor(anchor_id: str):
    """Get anchor details from blockchain"""
    try:
        near_contract = await get_near_contract()
        anchor_data = await near_contract.get_anchor(anchor_id)
        
        if not anchor_data:
            raise HTTPException(status_code=404, detail="Anchor not found")
        
        return {
            "success": True,
            "data": anchor_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
