"""
Pydantic data models for AQL Platform API
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class StudentLevel(str, Enum):
    """Student proficiency levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    message: str = Field(default="AQL Platform is running", description="Status message")


class SessionType(str, Enum):
    """Types of learning sessions"""
    ACCELERATION = "acceleration"
    BALANCED = "balanced"
    CONSOLIDATION = "consolidation"
    RESCUE = "rescue"


class LearningSession(BaseModel):
    """Adaptive learning session model"""
    session_id: str = Field(..., description="Unique session identifier")
    session_type: SessionType = Field(..., description="Type of learning session")
    new_verses: int = Field(ge=0, description="Number of new verses to learn")
    revision_percentage: int = Field(ge=0, le=100, description="Percentage of time for revision")
    focus_verses: Optional[List[str]] = Field(None, description="Specific verses to focus on")
    duration_minutes: int = Field(default=30, description="Estimated session duration")


class StudentMetrics(BaseModel):
    """Student learning metrics"""
    student_id: str
    total_verses_learned: int = Field(ge=0)
    retention_rate: float = Field(ge=0, le=100, description="Memory retention percentage")
    consistency_score: float = Field(ge=0, le=100, description="Consistency in practice")
    ars_score: float = Field(ge=0, le=100, description="Adaptive Readiness Score")


class ErrorResponse(BaseModel):
    """Error response model"""
    detail: str = Field(..., description="Error description")
    error_code: Optional[str] = Field(None, description="Error code for debugging")
