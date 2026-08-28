"""
AQL Platform Entry Point
Adaptive Quran Learning Platform - Exposes FastAPI app for Vercel/cloud deployment
"""
from api.server import app

# The app object is now available at the module level for:
# - Vercel serverless runtime
# - Docker containers
# - Traditional ASGI servers
#
# For local development, run: uvicorn app:app --reload
