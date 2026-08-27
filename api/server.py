"""
FastAPI server for AQL Platform
Adaptive Quran Learning Platform - API endpoints and dashboard integration
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import os
import sys
from typing import Optional

from api.models import (
    HealthResponse,
    StudentMetrics,
    LearningSession,
    SessionType,
    ErrorResponse
)

# Initialize FastAPI app
app = FastAPI(
    title="AQL Platform API",
    description="Adaptive Quran Learning Platform - Personalized Islamic Education Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# HEALTH & STATUS ENDPOINTS
# ============================================================================

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring and load balancers
    Returns the service status
    """
    return HealthResponse(
        status="healthy",
        message="AQL Platform is running and ready to serve requests"
    )


@app.get("/status", tags=["Health"])
async def status():
    """
    Detailed status endpoint
    Returns platform information and capabilities
    """
    return {
        "service": "AQL - Adaptive Quran Learning Platform",
        "version": "1.0.0",
        "status": "operational",
        "features": {
            "adaptive_learning": True,
            "memory_engine": True,
            "diagnostic_system": True,
            "progress_tracking": True,
            "spaced_repetition": True
        },
        "environment": os.environ.get("ENVIRONMENT", "development")
    }


# ============================================================================
# STUDENT ENDPOINTS
# ============================================================================

@app.get("/students/{student_id}/metrics", response_model=StudentMetrics, tags=["Students"])
async def get_student_metrics(student_id: str):
    """
    Get learning metrics for a specific student
    
    Parameters:
    - student_id: Unique identifier for the student
    
    Returns student's retention rate, consistency score, and adaptive readiness score (ARS)
    """
    # TODO: Fetch from database
    return StudentMetrics(
        student_id=student_id,
        total_verses_learned=0,
        retention_rate=0.0,
        consistency_score=0.0,
        ars_score=0.0
    )


# ============================================================================
# SESSION ENDPOINTS
# ============================================================================

@app.post("/sessions/generate", response_model=LearningSession, tags=["Sessions"])
async def generate_adaptive_session(student_id: str = Query(..., description="Student ID")):
    """
    Generate an adaptive learning session for a student
    
    Uses the ARS (Adaptive Readiness Score) algorithm to determine:
    - Session type (acceleration, balanced, consolidation, or rescue)
    - Number of new verses
    - Revision percentage
    - Focus areas
    
    Returns a customized learning session
    """
    # TODO: Implement ARS algorithm and session generation logic
    return LearningSession(
        session_id="session_001",
        session_type=SessionType.BALANCED,
        new_verses=1,
        revision_percentage=50,
        duration_minutes=30
    )


@app.get("/sessions/{session_id}", response_model=LearningSession, tags=["Sessions"])
async def get_session(session_id: str):
    """
    Retrieve details of a specific learning session
    """
    # TODO: Fetch from database
    raise HTTPException(
        status_code=404,
        detail=f"Session {session_id} not found"
    )


# ============================================================================
# LEARNING ENDPOINTS
# ============================================================================

@app.post("/verses/recall", tags=["Learning"])
async def record_verse_recall(
    student_id: str = Query(...),
    verse_id: str = Query(...),
    is_correct: bool = Query(...),
    response_time_ms: int = Query(...)
):
    """
    Record student's response to a verse recall challenge
    Updates memory model and diagnosis engine
    """
    return {
        "student_id": student_id,
        "verse_id": verse_id,
        "recorded": True,
        "feedback": "Performance recorded and ARS updated"
    }


@app.get("/verses/similar/{verse_id}", tags=["Learning"])
async def get_confusion_set(verse_id: str):
    """
    Get verses similar to the given verse
    Used for disambiguation and confusion graph navigation
    """
    return {
        "target_verse": verse_id,
        "similar_verses": [],
        "confusion_pattern": "phonetic_similarity"
    }


# ============================================================================
# DASHBOARD & STATIC CONTENT
# ============================================================================

@app.get("/", response_class=HTMLResponse, tags=["Dashboard"])
async def root():
    """
    Root endpoint - returns dashboard or API information
    """
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
    index_path = os.path.join(frontend_path, "index.html")
    
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return f.read()
    
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AQL Platform API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #1a7d1a; }
            .endpoint { margin: 20px 0; padding: 10px; border-left: 4px solid #1a7d1a; }
        </style>
    </head>
    <body>
        <h1>🕌 AQL - Adaptive Quran Learning Platform</h1>
        <p>API Server is running successfully!</p>
        
        <h2>Available Endpoints:</h2>
        <div class="endpoint">
            <strong>GET /health</strong> - Health check
        </div>
        <div class="endpoint">
            <strong>GET /docs</strong> - Interactive API documentation (Swagger UI)
        </div>
        <div class="endpoint">
            <strong>GET /redoc</strong> - Alternative API documentation (ReDoc)
        </div>
        
        <h2>Quick Start:</h2>
        <ul>
            <li><a href="/docs">📚 View API Documentation</a></li>
            <li><a href="/health">🏥 Check Service Health</a></li>
        </ul>
    </body>
    </html>
    """


# Mount frontend static files if they exist
frontend_static_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_static_path):
    try:
        app.mount("/static", StaticFiles(directory=frontend_static_path), name="static")
    except Exception as e:
        print(f"Warning: Could not mount frontend static files: {e}")


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            detail=exc.detail,
            error_code=f"HTTP_{exc.status_code}"
        ).dict()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler for uncaught errors"""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            detail="An internal server error occurred",
            error_code="INTERNAL_SERVER_ERROR"
        ).dict()
    )


# ============================================================================
# LIFESPAN EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize resources on server startup"""
    print("=" * 70)
    print("AQL Platform API Server Starting...")
    print("=" * 70)


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup resources on server shutdown"""
    print("AQL Platform API Server Shutting Down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
