"""
CallGuard Sentinel - Main Backend Service
Orchestrates all microservices and provides the main API gateway
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import service modules
from services.audio_ingestion import audio_router
from services.transcription import transcription_router
from services.feature_extraction import feature_router
from services.analysis import analysis_router
from services.alerting import alerting_router
from services.database import init_database

app = FastAPI(
    title="CallGuard Sentinel API",
    description="Real-time scam detection and call analysis system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include service routers
app.include_router(audio_router, prefix="/api/audio", tags=["audio"])
app.include_router(transcription_router, prefix="/api/transcription", tags=["transcription"])
app.include_router(feature_router, prefix="/api/features", tags=["features"])
app.include_router(analysis_router, prefix="/api/analysis", tags=["analysis"])
app.include_router(alerting_router, prefix="/api/alerts", tags=["alerts"])

@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup"""
    await init_database()
    print("CallGuard Sentinel backend started successfully")

@app.get("/")
async def root():
    return {"message": "CallGuard Sentinel API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "audio_ingestion": "running",
            "transcription": "running", 
            "feature_extraction": "running",
            "analysis": "running",
            "alerting": "running"
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
