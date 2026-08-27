import uvicorn
import os
import sys
import socket
import webbrowser
import threading
import time

# Import the actual FastAPI app
from api.server import app

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

def find_available_port(start_port=8080, max_attempts=20):
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
    return start_port

def open_browser_delayed(url):
    time.sleep(1.2)
    try:
        webbrowser.open(url)
    except Exception:
        pass

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)

    is_cloud = bool(os.environ.get("PORT") or os.environ.get("K_SERVICE") or os.environ.get("RAILWAY_ENVIRONMENT"))
    host = os.environ.get("HOST", "0.0.0.0" if is_cloud else "127.0.0.1")
    
    if os.environ.get("PORT"):
        port = int(os.environ.get("PORT"))
    else:
        port = find_available_port(8080)
        
    url = f"http://{'127.0.0.1' if host == '0.0.0.0' else host}:{port}"
    
    print("===================================================================")
    print("  AQL - Adaptive Quran Learning Platform (Production Ready)")
    print("===================================================================")
    print(f"  Listening on:       http://{host}:{port}")
    print(f"  Web Platform:       {url}")
    print(f"  Health Check:       {url}/health")
    print(f"  OpenAPI / Swagger:  {url}/docs")
    print("===================================================================")

    if not is_cloud:
        threading.Thread(target=open_browser_delayed, args=(url,), daemon=True).start()

    uvicorn.run(app, host=host, port=port, reload=False, log_level="info")
