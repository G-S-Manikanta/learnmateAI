# LearnMate AI Tutor Backend

A Python backend service for the LearnMate AI Tutor using OpenAI GPT-3.5 Turbo, built with FastAPI.

## Features

- 🤖 **AI-Powered Educational Assistant** using OpenAI GPT-3.5 Turbo
- 📚 **Subject-Specific Help** for Mathematics, Science, Computer Science, and more
- 💬 **Conversation History** support for context-aware responses
- 🎯 **Adaptive Learning** levels (beginner, intermediate, advanced)
- 🔍 **Subject Detection** automatically identifies the topic being discussed
- 📝 **Study Tips & Suggestions** provides helpful learning strategies
- 🌐 **CORS Enabled** for seamless frontend integration

## System Prompt

The AI tutor is configured with this educational-focused prompt:

```
You are an intelligent and friendly educational assistant called LearnMate AI Tutor. You help students with their questions about courses, topics, and general academic queries. 

Your key characteristics:
- Keep answers clear, concise, and supportive
- Be accurate and always encourage curiosity and learning
- If a user asks something outside the scope of education, politely guide them back to educational topics
- Provide step-by-step explanations when solving problems
- Suggest related topics or follow-up questions when appropriate
- Adapt your language to the student's level (beginner, intermediate, advanced)
- Use examples and analogies to make complex concepts easier to understand
```

## Quick Setup

### Prerequisites
- Python 3.8+
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run setup script:**
   ```bash
   # On Windows
   setup.bat
   
   # On Linux/Mac
   chmod +x setup.sh && ./setup.sh
   ```

3. **Add your OpenAI API key to `.env`:**
   ```bash
   OPENAI_API_KEY=your_api_key_here
   ```

4. **Start the server:**
   ```bash
   python main.py
   ```

## Manual Installation

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   Create a `.env` file with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   PORT=8000
   HOST=localhost
   CORS_ORIGINS=http://localhost:4200,http://localhost:3000
   ```

3. **Run the server:**
   ```bash
   python main.py
   ```

## API Endpoints

### Main Chat Endpoint
```
POST /api/tutor/chat
```

**Request:**
```json
{
  "message": "Can you help me understand calculus derivatives?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-07-29T10:00:00Z"
    }
  ],
  "subject": "mathematics",
  "user_level": "intermediate"
}
```

**Response:**
```json
{
  "response": "I'd be happy to help you understand calculus derivatives! A derivative represents the rate of change of a function at any given point...",
  "suggestions": [
    "Would you like to see step-by-step solving examples?",
    "Should we practice with similar problems?"
  ],
  "subject_detected": "mathematics",
  "confidence": 0.9,
  "timestamp": "2024-07-29T10:00:01Z"
}
```

### Get Available Subjects
```
GET /api/tutor/subjects
```

Returns all subjects the tutor can help with, including topics and icons.

### Get Study Tips
```
GET /api/tutor/study-tips
```

Returns general study tips and learning strategies.

### Health Check
```
GET /health
```

Returns server health status.

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── models.py              # Pydantic models for request/response
├── ai_tutor_service.py    # Core AI tutor logic and OpenAI integration
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create this)
├── setup.bat             # Windows setup script
├── setup.sh              # Linux/Mac setup script
└── README.md             # This file
```

## Core Features Explained

### 1. Educational Focus
- The AI tutor is specifically trained to handle educational queries
- Non-educational questions are politely redirected back to learning topics
- Encourages curiosity and provides supportive responses

### 2. Subject Detection
- Automatically detects the subject based on keywords in the user's message
- Supports: Mathematics, Physics, Chemistry, Biology, Computer Science, English, History, Geography

### 3. Adaptive Responses
- Adjusts explanation complexity based on user level (beginner/intermediate/advanced)
- Provides step-by-step explanations for problem-solving
- Uses examples and analogies for better understanding

### 4. Conversation Context
- Maintains conversation history for context-aware responses
- Limits history to last 10 messages to stay within token limits
- Builds proper context for OpenAI API calls

### 5. Suggestions System
- Provides follow-up suggestions based on the subject and response
- Subject-specific suggestions for deeper learning
- Generic educational suggestions for continued engagement

## API Integration with Angular Frontend

The backend is designed to work seamlessly with the Angular frontend. Update your Angular AI tutor service to use these endpoints:

```typescript
// In your Angular ai-tutor.service.ts
private baseUrl = 'http://localhost:8000';

async sendMessage(message: string, history: ChatMessage[]): Promise<TutorResponse> {
  const response = await this.http.post<TutorResponse>(`${this.baseUrl}/api/tutor/chat`, {
    message,
    conversation_history: history,
    user_level: 'intermediate'
  }).toPromise();
  
  return response;
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` |
| `PORT` | Server port | `8000` |
| `HOST` | Server host | `localhost` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:4200` |

## Error Handling

The API includes comprehensive error handling:
- Missing API key validation
- Empty message validation
- OpenAI API error handling
- Global exception handling with proper error responses

## Development

**Start in development mode:**
```bash
python main.py
```

**View API documentation:**
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Production Deployment

For production deployment, consider:
- Using a production WSGI server like Gunicorn
- Setting up proper environment variable management
- Implementing rate limiting and authentication
- Using a reverse proxy like Nginx

## Support

The AI tutor covers these subjects:
- **Mathematics:** Algebra, Calculus, Geometry, Statistics, Trigonometry
- **Science:** Physics, Chemistry, Biology
- **Computer Science:** Programming, Algorithms, Data Structures
- **Languages:** English Grammar, Literature, Writing
- **Social Studies:** History, Geography, Economics
- **Study Skills:** Note-taking, Time management, Learning strategies

---

🎓 **Happy Learning with LearnMate AI Tutor!** 📚
