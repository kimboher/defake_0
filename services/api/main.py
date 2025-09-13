from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

from routes import anchor, verify, health
from config.supabase import supabase_client
from config.near import get_near_contract

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Defake API",
    description="Media Integrity Backend with NEAR Blockchain",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["*"]  # Configure properly for production
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(anchor.router, prefix="/v1/anchors", tags=["anchors"])
app.include_router(verify.router, prefix="/v1/verify", tags=["verify"])

@app.get("/")
async def root():
    return {
        "message": "Defake API - Media Integrity Backend",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 3001)),
        reload=True
    )
