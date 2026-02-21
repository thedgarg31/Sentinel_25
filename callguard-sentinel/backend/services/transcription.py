"""
Transcription Service
Converts live audio streams to text using OpenAI Whisper
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
import asyncio
import base64
import json
import logging
import tempfile
import os
from datetime import datetime
from typing import Dict, List
import httpx

# Whisper imports
import whisper
import torch
import torchaudio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

transcription_router = APIRouter()

class TranscriptionService:
    def __init__(self):
        # Load Whisper model (use base model for speed)
        self.model = whisper.load_model("base")
        self.feature_service_url = "http://localhost:8002/api/features/extract"
        self.analysis_service_url = "http://localhost:8003/api/analysis/predict"
        
        # Store audio buffers for each call
        self.call_buffers: Dict[str, List[bytes]] = {}
        
    async def process_audio_chunk(self, call_id: str, audio_chunk: str, timestamp: str, user_id: str):
        """Process audio chunk and transcribe"""
        try:
            # Decode base64 audio data
            audio_bytes = base64.b64decode(audio_chunk)
            
            # Add to call buffer
            if call_id not in self.call_buffers:
                self.call_buffers[call_id] = []
            
            self.call_buffers[call_id].append(audio_bytes)
            
            # Process every 5 chunks or every 10 seconds
            if len(self.call_buffers[call_id]) >= 5:
                await self.transcribe_accumulated_audio(call_id, user_id)
                
        except Exception as e:
            logger.error(f"Error processing audio chunk for call {call_id}: {e}")
    
    async def transcribe_accumulated_audio(self, call_id: str, user_id: str):
        """Transcribe accumulated audio chunks"""
        try:
            if call_id not in self.call_buffers or not self.call_buffers[call_id]:
                return
            
            # Combine audio chunks
            combined_audio = b''.join(self.call_buffers[call_id])
            
            # Save to temporary file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(combined_audio)
                temp_path = temp_file.name
            
            try:
                # Transcribe using Whisper
                result = self.model.transcribe(temp_path, language="en")
                transcribed_text = result["text"].strip()
                
                if transcribed_text:
                    logger.info(f"Transcribed for call {call_id}: {transcribed_text}")
                    
                    # Forward to feature extraction service
                    await self.forward_to_feature_extraction(
                        call_id, transcribed_text, user_id
                    )
                
                # Clear buffer
                self.call_buffers[call_id] = []
                
            finally:
                # Clean up temporary file
                os.unlink(temp_path)
                
        except Exception as e:
            logger.error(f"Error transcribing audio for call {call_id}: {e}")
    
    async def forward_to_feature_extraction(self, call_id: str, text: str, user_id: str):
        """Forward transcribed text to feature extraction service"""
        try:
            payload = {
                "call_id": call_id,
                "text": text,
                "user_id": user_id,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.feature_service_url,
                    json=payload,
                    timeout=10.0
                )
                
                if response.status_code != 200:
                    logger.error(f"Feature extraction service error: {response.text}")
                    
        except Exception as e:
            logger.error(f"Error forwarding to feature extraction: {e}")
    
    async def finalize_call_transcription(self, call_id: str, user_id: str):
        """Process any remaining audio chunks when call ends"""
        if call_id in self.call_buffers and self.call_buffers[call_id]:
            await self.transcribe_accumulated_audio(call_id, user_id)
        
        # Clean up
        if call_id in self.call_buffers:
            del self.call_buffers[call_id]

# Initialize service
transcription_service = TranscriptionService()

@transcription_router.post("/process")
async def process_audio_chunk(
    call_id: str,
    audio_chunk: str,
    timestamp: str,
    user_id: str
):
    """Process audio chunk and transcribe"""
    await transcription_service.process_audio_chunk(call_id, audio_chunk, timestamp, user_id)
    return {"status": "processed"}

@transcription_router.post("/finalize/{call_id}")
async def finalize_call(call_id: str, user_id: str):
    """Finalize transcription for a call"""
    await transcription_service.finalize_call_transcription(call_id, user_id)
    return {"status": "finalized"}

@transcription_router.get("/call/{call_id}/status")
async def get_transcription_status(call_id: str):
    """Get transcription status for a call"""
    buffer_size = len(transcription_service.call_buffers.get(call_id, []))
    return {
        "call_id": call_id,
        "buffer_size": buffer_size,
        "status": "active" if buffer_size > 0 else "idle"
    }

@transcription_router.post("/test-transcription")
async def test_transcription(audio_file_path: str):
    """Test transcription with a file"""
    try:
        result = transcription_service.model.transcribe(audio_file_path)
        return {
            "text": result["text"],
            "language": result["language"],
            "segments": result["segments"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
