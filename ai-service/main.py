"""
AI Roadmap Generator - FastAPI Application Entry Point
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.routers import roadmap

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info(f"[START] AI Service (Roadmap Groq)")
    logger.info(f"[ENV] {'Development' if settings.DEBUG else 'Production'}")
    logger.info(f"[GROQ MODEL] {settings.GROQ_MODEL}")
    api_key_preview = settings.GROQ_API_KEY[:15] + "..." if settings.GROQ_API_KEY and len(settings.GROQ_API_KEY) > 15 else "NOT SET"
    logger.info(f"[GROQ KEY] {api_key_preview}")
    yield
    # Shutdown
    logger.info("[STOP] Shutting down AI Service")


app = FastAPI(
    title="CodeMind Platform - AI Service",
    description="AI Service: Lightweight Roadmap Generation (Groq)",
    version="2.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(roadmap.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "CodeMind Platform - AI Service",
        "version": "2.0.0",
        "providers": ["groq"],
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    api_key_preview = settings.GROQ_API_KEY[:15] + "..." if settings.GROQ_API_KEY and len(settings.GROQ_API_KEY) > 15 else "NOT SET"
    return {
        "status": "healthy",
        "providers": {
            "groq": {
                "configured": bool(settings.GROQ_API_KEY),
                "model": settings.GROQ_MODEL,
                "api_key_preview": api_key_preview,
            }
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
