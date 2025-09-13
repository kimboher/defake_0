from fastapi import APIRouter, HTTPException
from config.supabase import supabase_client
from config.near import get_near_contract
from datetime import datetime

router = APIRouter()

@router.get("/")
async def health_check():
    """Health check endpoint"""
    health = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": "unknown",
            "blockchain": "unknown"
        }
    }
    
    # Check Supabase
    try:
        supabase_client.table("claims").select("count").limit(1).execute()
        health["services"]["database"] = "healthy"
    except:
        health["services"]["database"] = "unhealthy"
    
    # Check NEAR
    try:
        await get_near_contract()
        health["services"]["blockchain"] = "healthy"
    except:
        health["services"]["blockchain"] = "unhealthy"
    
    overall_status = "healthy" if all(
        status == "healthy" for status in health["services"].values()
    ) else "degraded"
    
    health["status"] = overall_status
    
    return health
