from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: Optional[datetime] = None


class TutorRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    subject: Optional[str] = None
    user_level: Optional[str] = "beginner"  # beginner, intermediate, advanced


class TutorResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = []
    subject_detected: Optional[str] = None
    confidence: Optional[float] = None
    timestamp: datetime


class ErrorResponse(BaseModel):
    error: str
    message: str
    timestamp: datetime
