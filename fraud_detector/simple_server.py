from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import random
import asyncio

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"],
)

@app.post("/analyze/fast/")
async def analyze_audio_fast(file: UploadFile = File(...)):
    """Simple mock analysis for testing"""
    try:
        # Read the file
        contents = await file.read()
        
        # Simulate processing time
        await asyncio.sleep(2)
        
        # Mock analysis result
        fraud_score = random.uniform(0.1, 0.9)
        is_fraud = fraud_score > 0.5
        
        result = {
            "is_fraud": is_fraud,
            "fraud_score": fraud_score,
            "explanation": "Mock analysis for testing purposes" if not is_fraud else "Mock fraud detected for testing",
            "confidence": fraud_score,
            "text_features": {
                "urgency": random.uniform(0, 1),
                "authority": random.uniform(0, 1),
                "threats": random.uniform(0, 1)
            },
            "audio_features": {
                "energy_spikes": random.uniform(0, 10),
                "pitch_variance": random.uniform(0, 3000),
                "stress_indicators": random.uniform(0, 1)
            }
        }
        
        return result
        
    except Exception as e:
        return {"error": str(e), "is_fraud": False, "fraud_score": 0.0}

@app.get("/")
async def root():
    return {"message": "Fraud detection API is running", "status": "ok"}

if __name__ == "__main__":
    print("Starting mock fraud detection server on http://localhost:8002")
    uvicorn.run(app, host="0.0.0.0", port=8002)
