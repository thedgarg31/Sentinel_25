import subprocess
import webbrowser
import time
import os
from threading import Thread

def start_backend():
    """Start the fraud detection backend server"""
    print("🔧 Starting Backend Server...")
    os.chdir("fraud_detector")
    subprocess.run(["python", "simple_server.py"])

def start_frontend():
    """Start the React frontend development server"""
    print("📱 Starting Frontend Server...")
    os.chdir("../callguard-sentinel")
    subprocess.run(["npm", "run", "dev"])

def open_browser():
    """Open both frontend and backend in browser tabs"""
    time.sleep(8)  # Wait for servers to start
    print("🌐 Opening Browser Tabs...")
    webbrowser.open("http://localhost:8081")  # Frontend
    webbrowser.open("http://localhost:8001")  # Backend API

if __name__ == "__main__":
    print("🚀 Starting Complete CallGuard Sentinel System...")
    print("=" * 50)
    
    # Start backend in background thread
    backend_thread = Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to initialize
    time.sleep(3)
    
    # Start frontend in background thread
    frontend_thread = Thread(target=start_frontend, daemon=True)
    frontend_thread.start()
    
    # Open browser after servers start
    browser_thread = Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    print("✅ System Starting Up...")
    print("📱 Frontend: http://localhost:8081")
    print("🔧 Backend:  http://localhost:8001")
    print("🌐 Browser tabs will open automatically...")
    print("=" * 50)
    print("Press Ctrl+C to stop all servers")
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        exit(0)
