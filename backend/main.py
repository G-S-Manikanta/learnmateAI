from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import os
from datetime import datetime
from dotenv import load_dotenv

from models import TutorRequest, TutorResponse, ErrorResponse, ChatMessage
from ai_tutor_service import AITutorService

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="LearnMate AI Tutor Backend",
    description="AI-powered educational assistant using OpenAI GPT-3.5 Turbo",
    version="1.0.0"
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:4200").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Initialize AI Tutor Service
ai_tutor = AITutorService()

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "🎓 Welcome to LearnMate AI Tutor Backend!",
        "description": "AI-powered educational assistant using OpenAI GPT-3.5 Turbo",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/tutor/chat",
            "subjects": "/api/tutor/subjects", 
            "study_tips": "/api/tutor/study-tips",
            "health": "/health",
            "docs": "/docs"
        },
        "status": "running",
        "timestamp": datetime.now()
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(), "service": "LearnMate AI Tutor"}

# Main chat endpoint
@app.post("/api/tutor/chat", response_model=TutorResponse)
async def chat_with_tutor(request: TutorRequest):
    """
    Main endpoint for chatting with the AI tutor
    """
    try:
        # Validate OpenAI API key
        if not os.getenv("OPENAI_API_KEY"):
            raise HTTPException(
                status_code=500, 
                detail="OpenAI API key not configured"
            )
        
        # Validate message content
        if not request.message.strip():
            raise HTTPException(
                status_code=400, 
                detail="Message cannot be empty"
            )
        
        # Check if content is educational (optional validation)
        if not ai_tutor.validate_educational_content(request.message):
            return TutorResponse(
                response="I'm here to help with your studies and learning! Let's focus on educational topics. Is there something specific you'd like to learn about today? 📚",
                suggestions=[
                    "Ask about mathematics, science, or any academic subject",
                    "Request help with homework or study techniques",
                    "Explore concepts you're curious about"
                ],
                subject_detected=None,
                confidence=1.0,
                timestamp=datetime.now()
            )
        
        # Generate response using AI tutor service
        response = await ai_tutor.generate_response(
            message=request.message,
            conversation_history=request.conversation_history,
            subject=request.subject,
            user_level=request.user_level
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

# Get available subjects
@app.get("/api/tutor/subjects")
async def get_subjects():
    """
    Get list of available subjects the tutor can help with
    """
    subjects = {
        "mathematics": {
            "name": "Mathematics",
            "topics": ["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry"],
            "icon": "🔢"
        },
        "physics": {
            "name": "Physics", 
            "topics": ["Mechanics", "Thermodynamics", "Electricity", "Waves", "Quantum Physics"],
            "icon": "⚛️"
        },
        "chemistry": {
            "name": "Chemistry",
            "topics": ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Biochemistry"],
            "icon": "🧪"
        },
        "biology": {
            "name": "Biology",
            "topics": ["Cell Biology", "Genetics", "Evolution", "Ecology", "Physiology"],
            "icon": "🧬"
        },
        "computer_science": {
            "name": "Computer Science",
            "topics": ["Programming", "Algorithms", "Data Structures", "Databases", "AI/ML"],
            "icon": "💻"
        },
        "english": {
            "name": "English",
            "topics": ["Grammar", "Literature", "Writing", "Reading Comprehension", "Poetry"],
            "icon": "📝"
        },
        "history": {
            "name": "History",
            "topics": ["World History", "Ancient Civilizations", "Modern History", "Historical Analysis"],
            "icon": "📜"
        },
        "geography": {
            "name": "Geography",
            "topics": ["Physical Geography", "Human Geography", "Climate", "Cartography"],
            "icon": "🌍"
        }
    }
    
    return {"subjects": subjects, "timestamp": datetime.now()}

# Get study tips
@app.get("/api/tutor/study-tips")
async def get_study_tips():
    """
    Get general study tips and learning strategies
    """
    tips = [
        {
            "category": "Time Management",
            "tip": "Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break",
            "icon": "⏰"
        },
        {
            "category": "Active Learning",
            "tip": "Teach concepts to someone else or explain them out loud to reinforce understanding",
            "icon": "🗣️"
        },
        {
            "category": "Note Taking",
            "tip": "Use the Cornell Note-Taking System to organize and review your notes effectively",
            "icon": "📝"
        },
        {
            "category": "Practice",
            "tip": "Practice problems regularly instead of just reading - active recall strengthens memory",
            "icon": "🎯"
        },
        {
            "category": "Environment",
            "tip": "Create a dedicated, distraction-free study space with good lighting and organization",
            "icon": "🏠"
        }
    ]
    
    return {"tips": tips, "timestamp": datetime.now()}

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal Server Error",
            message=str(exc),
            timestamp=datetime.now()
        ).dict()
    )

# Run the server
if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "localhost")
    port = int(os.getenv("PORT", 8000))
    
    print(f"🚀 Starting LearnMate AI Tutor Backend on {host}:{port}")
    print("📚 Educational AI Assistant powered by OpenAI GPT-3.5 Turbo")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
