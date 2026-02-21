import os
import uuid
import asyncio
import random
import json
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import aiofiles

# Initialize FastAPI
app = FastAPI(
    title="Cybercup25 Advanced Fraud Detection API",
    description="Next-generation caller protection with AI-powered fraud detection",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, job_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[job_id] = websocket

    def disconnect(self, job_id: str):
        if job_id in self.active_connections:
            del self.active_connections[job_id]

    async def send_json(self, job_id: str, data: dict):
        if job_id in self.active_connections:
            await self.active_connections[job_id].send_text(json.dumps(data))

manager = ConnectionManager()

# Directory for file uploads
UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Mock data for demonstration
MOCK_CALLER_DATABASE = {
    "+1-555-0123": {
        "name": "John Smith",
        "type": "individual",
        "risk_level": "low",
        "risk_score": 0.15,
        "report_count": 0,
        "verified_business": False
    },
    "+1-555-0456": {
        "name": "IRS Scam",
        "type": "scam",
        "risk_level": "critical",
        "risk_score": 0.95,
        "report_count": 342,
        "scam_type": "Tax Authority Impersonation",
        "voice_fingerprint": "fp_12345",
        "associated_numbers": ["+1-555-0457", "+1-555-0458"]
    },
    "+1-555-0789": {
        "name": "Microsoft Support",
        "type": "scam",
        "risk_level": "high",
        "risk_score": 0.85,
        "report_count": 156,
        "scam_type": "Tech Support Scam",
        "voice_fingerprint": "fp_67890"
    }
}

@app.on_event("startup")
async def startup_event():
    print("🚀 Cybercup25 Advanced Fraud Detection System Starting...")
    print("🔥 Next-Generation Caller Protection Ready!")
    print("📊 Features: BERT Analysis, LSTM Audio, Voice Fingerprinting")
    print("🛡️ Emergency Protection & OTP Detection Active")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Cybercup25 Advanced Fraud Detection API",
        "status": "running",
        "version": "2.0.0",
        "features": [
            "BERT-based text analysis",
            "LSTM audio processing",
            "Voice fingerprinting",
            "Real-time fraud detection",
            "Emergency alert system",
            "OTP protection",
            "Global threat intelligence"
        ],
        "timestamp": datetime.now().isoformat()
    }

@app.post("/analyze/advanced/")
async def analyze_call_advanced(file: UploadFile = File(...), transcript: str = None):
    """Advanced call analysis with all AI models (mock implementation)"""
    try:
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Save uploaded file
        file_extension = file.filename.split('.')[-1] if file.filename else 'webm'
        file_path = os.path.join(UPLOADS_DIR, f"{job_id}.{file_extension}")
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        # Simulate advanced AI analysis
        await asyncio.sleep(2)  # Simulate processing time
        
        # Mock advanced analysis results
        fraud_score = random.uniform(0.1, 0.95)
        risk_level = 'low' if fraud_score < 0.3 else 'medium' if fraud_score < 0.6 else 'high' if fraud_score < 0.8 else 'critical'
        
        # Mock BERT text analysis
        text_analysis = {
            "fraud_score": fraud_score,
            "keyword_analysis": {
                "urgency": random.uniform(0, 1),
                "authority": random.uniform(0, 1),
                "financial": random.uniform(0, 1),
                "personal_info": random.uniform(0, 1),
                "threats": random.uniform(0, 1)
            },
            "pattern_score": random.uniform(0, 1),
            "linguistic_features": {
                "uppercase_ratio": random.uniform(0, 0.3),
                "exclamation_count": random.randint(0, 5),
                "stress_indicators": random.uniform(0, 1)
            },
            "explanations": generate_explanations(fraud_score)
        }
        
        # Mock LSTM audio analysis
        audio_analysis = {
            "fraud_score": fraud_score,
            "lstm_score": random.uniform(0, 1),
            "acoustic_features": {
                "stress_indicator": random.uniform(0, 1),
                "pitch_variance": random.uniform(0, 3000),
                "speech_rate": random.uniform(0, 1),
                "background_noise": random.uniform(0, 1)
            },
            "explanations": generate_audio_explanations(fraud_score)
        }
        
        # Mock voice fingerprinting
        voice_match = None
        if random.random() > 0.7:  # 30% chance of matching known scammer
            voice_match = {
                "voice_id": f"scammer_{random.randint(1000, 9999)}",
                "similarity": random.uniform(0.85, 0.98),
                "confidence": random.uniform(0.8, 0.95),
                "network_info": {
                    "scam_type": random.choice(["IRS Impersonation", "Tech Support", "Bank Fraud"]),
                    "associated_numbers": [f"+1-555-{random.randint(1000, 9999)}" for _ in range(3)],
                    "reports_count": random.randint(50, 500)
                }
            }
        
        # Combine all results
        result = {
            "overall_fraud_score": fraud_score,
            "risk_level": risk_level,
            "text_analysis": text_analysis,
            "audio_analysis": audio_analysis,
            "voice_fingerprinting": voice_match,
            "explanations": generate_comprehensive_explanations(text_analysis, audio_analysis, voice_match),
            "recommendations": generate_recommendations(fraud_score, voice_match)
        }
        
        # Clean up file
        os.remove(file_path)
        
        return {
            "job_id": job_id,
            "timestamp": datetime.now().isoformat(),
            "analysis_type": "advanced",
            "result": result
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "fraud_score": 0.0,
            "risk_level": "low",
            "analysis_type": "error"
        }

@app.post("/analyze/text/")
async def analyze_text_only(text: str):
    """Analyze text for fraud indicators using BERT (mock implementation)"""
    try:
        # Simulate BERT analysis
        await asyncio.sleep(1)
        
        fraud_score = min(len(text.split()) * 0.05 + random.uniform(0, 0.3), 1.0)
        
        keyword_analysis = {
            "urgency": min(text.lower().count("urgent") * 0.3, 1.0),
            "authority": min(text.lower().count("irs") * 0.4, 1.0),
            "financial": min(text.lower().count("account") * 0.3, 1.0),
            "personal_info": min(text.lower().count("otp") * 0.5, 1.0),
            "threats": min(text.lower().count("arrest") * 0.6, 1.0)
        }
        
        result = {
            "fraud_score": fraud_score,
            "keyword_analysis": keyword_analysis,
            "pattern_score": random.uniform(0, 1),
            "risk_level": 'low' if fraud_score < 0.3 else 'medium' if fraud_score < 0.6 else 'high' if fraud_score < 0.8 else 'critical',
            "explanations": generate_explanations(fraud_score)
        }
        
        return {
            "timestamp": datetime.now().isoformat(),
            "analysis_type": "text_only",
            "result": result
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "fraud_score": 0.0,
            "risk_level": "low"
        }

@app.post("/voice/match/")
async def match_voiceprint(file: UploadFile = File(...)):
    """Match voice against known scammer database (mock implementation)"""
    try:
        # Save uploaded file
        job_id = str(uuid.uuid4())
        file_extension = file.filename.split('.')[-1] if file.filename else 'webm'
        file_path = os.path.join(UPLOADS_DIR, f"{job_id}.{file_extension}")
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        # Simulate voice matching
        await asyncio.sleep(1.5)
        
        # 30% chance of matching known scammer
        match = None
        if random.random() > 0.7:
            match = {
                "voice_id": f"scammer_{random.randint(1000, 9999)}",
                "similarity": random.uniform(0.85, 0.98),
                "confidence": random.uniform(0.8, 0.95),
                "network_info": {
                    "scam_type": random.choice(["IRS Impersonation", "Tech Support", "Bank Fraud"]),
                    "reports_count": random.randint(50, 500),
                    "active_since": datetime.now().isoformat()
                }
            }
        
        # Clean up file
        os.remove(file_path)
        
        return {
            "job_id": job_id,
            "timestamp": datetime.now().isoformat(),
            "voice_match": match,
            "voiceprint_created": True
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "voice_match": None
        }

@app.get("/stats/threat-intelligence")
async def get_threat_intelligence():
    """Get global threat intelligence data"""
    return {
        "timestamp": datetime.now().isoformat(),
        "global_stats": {
            "total_calls_analyzed": random.randint(150000, 200000),
            "scams_detected": random.randint(12000, 18000),
            "active_threats": random.randint(300, 500),
            "blocked_numbers": random.randint(8000, 12000)
        },
        "top_scam_types": [
            {"type": "IRS Impersonation", "count": random.randint(3000, 4000), "percentage": 27.5},
            {"type": "Tech Support", "count": random.randint(2500, 3500), "percentage": 23.2},
            {"type": "Bank Fraud", "count": random.randint(1800, 2500), "percentage": 17.3},
            {"type": "Social Security", "count": random.randint(1500, 2200), "percentage": 15.1},
            {"type": "Lottery/Prize", "count": random.randint(1000, 1500), "percentage": 9.9}
        ],
        "regional_threats": [
            {"region": "North America", "threat_level": "high", "active_scams": random.randint(120, 180)},
            {"region": "Europe", "threat_level": "medium", "active_scams": random.randint(70, 120)},
            {"region": "Asia", "threat_level": "high", "active_scams": random.randint(140, 200)},
            {"region": "Africa", "threat_level": "medium", "active_scams": random.randint(30, 70)}
        ],
        "recent_trends": [
            {"date": "2024-02-20", "scam_attempts": random.randint(400, 500), "blocked": random.randint(350, 450)},
            {"date": "2024-02-19", "scam_attempts": random.randint(380, 480), "blocked": random.randint(330, 430)},
            {"date": "2024-02-18", "scam_attempts": random.randint(350, 450), "blocked": random.randint(300, 400)},
            {"date": "2024-02-17", "scam_attempts": random.randint(370, 470), "blocked": random.randint(320, 420)},
            {"date": "2024-02-16", "scam_attempts": random.randint(360, 460), "blocked": random.randint(310, 410)}
        ]
    }

@app.get("/models/status")
async def get_models_status():
    """Get status of all AI models"""
    return {
        "timestamp": datetime.now().isoformat(),
        "models": {
            "bert_text_analyzer": True,
            "lstm_audio_analyzer": True,
            "voice_fingerprinting": True,
            "advanced_detector": True,
            "emergency_system": True,
            "otp_protection": True
        },
        "system_status": "ready",
        "capabilities": [
            "Real-time fraud detection",
            "Voice fingerprinting",
            "Emergency alerts",
            "OTP protection",
            "Global threat intelligence",
            "Advanced AI analysis"
        ]
    }

@app.websocket("/ws/analyze/{job_id}")
async def websocket_analyze_endpoint(websocket: WebSocket, job_id: str):
    """Real-time analysis via WebSocket"""
    await manager.connect(job_id, websocket)
    
    try:
        while True:
            # Receive data from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "analyze":
                # Simulate real-time analysis
                await manager.send_json(job_id, {
                    "status": "analyzing",
                    "message": "Starting advanced fraud analysis...",
                    "progress": 10
                })
                
                await asyncio.sleep(1)
                await manager.send_json(job_id, {
                    "status": "analyzing",
                    "message": "Analyzing audio patterns with LSTM...",
                    "progress": 30
                })
                
                await asyncio.sleep(1)
                await manager.send_json(job_id, {
                    "status": "analyzing",
                    "message": "Processing text with BERT model...",
                    "progress": 60
                })
                
                await asyncio.sleep(1)
                await manager.send_json(job_id, {
                    "status": "analyzing",
                    "message": "Matching voice fingerprint...",
                    "progress": 85
                })
                
                await asyncio.sleep(0.5)
                
                # Return mock results
                fraud_score = random.uniform(0.1, 0.95)
                risk_level = 'low' if fraud_score < 0.3 else 'medium' if fraud_score < 0.6 else 'high' if fraud_score < 0.8 else 'critical'
                
                await manager.send_json(job_id, {
                    "status": "completed",
                    "progress": 100,
                    "result": {
                        "overall_fraud_score": fraud_score,
                        "risk_level": risk_level,
                        "explanations": generate_comprehensive_explanations({}, {}, None),
                        "recommendations": generate_recommendations(fraud_score, None)
                    }
                })
                
    except WebSocketDisconnect:
        manager.disconnect(job_id)

# Helper functions
def generate_explanations(score: float) -> list:
    explanations = []
    if score > 0.8:
        explanations.extend([
            "Critical threat level detected",
            "Multiple fraud indicators present",
            "Immediate action recommended"
        ])
    elif score > 0.6:
        explanations.extend([
            "High-risk patterns identified",
            "Exercise extreme caution"
        ])
    elif score > 0.3:
        explanations.extend([
            "Suspicious activity detected",
            "Verify caller identity"
        ])
    return explanations

def generate_audio_explanations(score: float) -> list:
    explanations = []
    if score > 0.6:
        explanations.extend([
            "Voice stress patterns detected",
            "Unusual speech characteristics"
        ])
    return explanations

def generate_comprehensive_explanations(text_analysis: dict, audio_analysis: dict, voice_match: dict) -> list:
    explanations = []
    
    if text_analysis.get("explanations"):
        explanations.extend(text_analysis["explanations"])
    
    if audio_analysis.get("explanations"):
        explanations.extend(audio_analysis["explanations"])
    
    if voice_match:
        explanations.append(f"Voice matches known scammer (confidence: {voice_match['confidence']:.2f})")
    
    return explanations

def generate_recommendations(score: float, voice_match: dict) -> list:
    recommendations = []
    
    if score > 0.8:
        recommendations.extend([
            "BLOCK this number immediately",
            "Report to authorities",
            "Do not engage with caller"
        ])
    elif score > 0.6:
        recommendations.extend([
            "Exercise extreme caution",
            "Verify caller identity independently",
            "Do not share personal information"
        ])
    elif score > 0.3:
        recommendations.extend([
            "Be cautious with this caller",
            "Avoid sharing sensitive information"
        ])
    
    if voice_match:
        recommendations.append("Known scammer voice detected - high threat level")
    
    return recommendations

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Cybercup25 Advanced Fraud Detection Server...")
    print("🔥 Next-Generation Caller Protection System")
    print("📍 URL: http://localhost:8003")
    print("📚 API Docs: http://localhost:8003/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8003)
