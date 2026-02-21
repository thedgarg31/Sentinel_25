# 🚀 CallGuard Sentinel - Complete Testing System

## 🎯 Quick Start - One Command Launch

### Method 1: Python Launcher (Recommended)
```bash
python start_complete_system.py
```
This will automatically:
- ✅ Start the backend fraud detection server
- ✅ Start the frontend React application  
- ✅ Open both servers in browser tabs
- ✅ Provide a complete testing environment

### Method 2: Manual Launch
```bash
# Terminal 1 - Backend
cd fraud_detector
python simple_server.py

# Terminal 2 - Frontend  
cd callguard-sentinel
npm run dev
```

## 🌐 Access Points

### 📱 Main Application (Frontend)
**URL:** http://localhost:8081
- **Dashboard** - View call statistics and analytics
- **Dialer** - Make test calls with fraud detection
- **Call History** - Review past calls and results
- **Contacts** - Manage contact list with risk indicators

### 🔧 API Server (Backend)
**URL:** http://localhost:8001
- **Analysis Endpoint:** `/analyze/fast/`
- **Health Check:** `/`
- **Mock fraud detection with realistic results**

## 🧪 Testing Features

### 📞 Call Testing
1. Go to http://localhost:8081
2. Click "Make Call" or navigate to dialer
3. Enter any phone number
4. Click the green "Call" button
5. Allow microphone access when prompted
6. Start recording (red button)
7. Speak for 5-10 seconds
8. End the call
9. View automatic fraud analysis results

### 🔍 Analysis Results
- **Fraud Score:** 0.0 - 1.0 probability
- **Threat Level:** Safe/Warning/Critical
- **Text Features:** Urgency, authority, threats detected
- **Audio Features:** Energy spikes, pitch variance, stress
- **Explanation:** Human-readable fraud detection reasoning

### 🎭 Mock Data
The system includes realistic mock data for:
- Call statistics (45 total calls, 8 scams blocked)
- Recent call history with timestamps
- Risk breakdown charts
- Top risky contacts with scores
- Live scam detection simulation

## 🛠️ System Architecture

```
Frontend (React)     Backend (Python/FastAPI)
     │                        │
     ├─ Dashboard             ├─ Audio Analysis
     ├─ Dialer                ├─ Text Processing  
     ├─ Call Screen           ├─ Fraud Detection
     ├─ History               ├─ Mock AI Models
     └─ Contacts              └─ REST API
```

## 🎯 Test Scenarios

### Scenario 1: Normal Call
- Dial any number
- Record normal speech
- Should show "Safe" result with low fraud score

### Scenario 2: Suspicious Call  
- Use urgent language ("your account will be closed")
- Mention financial topics ("bank", "credit card")
- Should show "Warning" or "Critical" result

### Scenario 3: Known Scam
- The system randomly assigns high fraud scores
- Tests the complete alert and UI response
- Shows detailed threat explanations

## 🔧 Troubleshooting

### Frontend Issues
- **Port 8081 busy:** Change with `npm run dev -- --port 3000`
- **Build errors:** Run `npm install` in callguard-sentinel folder

### Backend Issues  
- **Port 8001 busy:** Change port in simple_server.py
- **Python errors:** Run `pip install fastapi uvicorn aiofiles`

### Browser Issues
- **Microphone blocked:** Allow camera/microphone permissions
- **HTTPS errors:** Use http:// (not https://)

## 📱 Mobile Testing
The responsive design works on:
- ✅ Desktop browsers
- ✅ Tablet devices  
- ✅ Mobile phones
- ✅ Touch interfaces

## 🎉 Success Indicators

When everything works correctly:
- ✅ Both servers start without errors
- ✅ Browser tabs open automatically
- ✅ Frontend loads with dashboard data
- ✅ Call recording works with microphone
- ✅ Analysis returns realistic results
- ✅ UI updates in real-time

---

**🚀 Ready to test! Run `python start_complete_system.py` to begin.**
