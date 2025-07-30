import openai
import os
from typing import List, Dict, Optional
from datetime import datetime
from models import ChatMessage, TutorResponse
import json
import re


class AITutorService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        self.system_prompt = """You are an intelligent and friendly educational assistant called LearnMate AI Tutor. You help students with their questions about courses, topics, and general academic queries. 

Your key characteristics:
- Keep answers clear, concise, and supportive
- Be accurate and always encourage curiosity and learning
- If a user asks something outside the scope of education, politely guide them back to educational topics
- Provide step-by-step explanations when solving problems
- Suggest related topics or follow-up questions when appropriate
- Adapt your language to the student's level (beginner, intermediate, advanced)
- Use examples and analogies to make complex concepts easier to understand

Subjects you can help with include but are not limited to:
- Mathematics (algebra, calculus, geometry, statistics)
- Science (physics, chemistry, biology)
- Computer Science (programming, algorithms, data structures)
- Languages (grammar, literature, writing)
- History, Geography, Economics
- Study techniques and academic skills

If asked about non-educational topics, respond like: "I'm here to help with your studies and learning! Let's focus on educational topics. Is there something specific you'd like to learn about today?"

Always end your responses with encouraging words and offer to help with related questions."""

        # Subject detection keywords
        self.subject_keywords = {
            "mathematics": ["math", "algebra", "calculus", "geometry", "trigonometry", "statistics", "equation", "formula", "solve", "calculate"],
            "physics": ["physics", "force", "energy", "motion", "gravity", "electricity", "magnetism", "wave", "quantum"],
            "chemistry": ["chemistry", "atom", "molecule", "reaction", "element", "compound", "bond", "acid", "base"],
            "biology": ["biology", "cell", "dna", "gene", "evolution", "organism", "ecosystem", "photosynthesis"],
            "computer_science": ["programming", "algorithm", "code", "software", "python", "javascript", "database", "computer"],
            "english": ["grammar", "writing", "literature", "essay", "poem", "novel", "author", "reading"],
            "history": ["history", "war", "ancient", "medieval", "revolution", "empire", "civilization", "historical"],
            "geography": ["geography", "continent", "country", "climate", "map", "ocean", "mountain", "river"]
        }

    async def generate_response(self, message: str, conversation_history: List[ChatMessage], 
                              subject: Optional[str] = None, user_level: str = "beginner") -> TutorResponse:
        try:
            # Detect subject if not provided
            detected_subject = subject or self._detect_subject(message)
            
            # Build conversation context
            messages = self._build_conversation_context(message, conversation_history, user_level, detected_subject)
            
            # Generate response using OpenAI
            response = await self._call_openai(messages)
            
            # Extract suggestions from the response
            suggestions = self._extract_suggestions(response, detected_subject)
            
            return TutorResponse(
                response=response,
                suggestions=suggestions,
                subject_detected=detected_subject,
                confidence=0.9,  # You could implement confidence scoring
                timestamp=datetime.now()
            )
            
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")

    def _detect_subject(self, message: str) -> Optional[str]:
        """Detect the subject based on keywords in the message"""
        message_lower = message.lower()
        
        subject_scores = {}
        for subject, keywords in self.subject_keywords.items():
            score = sum(1 for keyword in keywords if keyword in message_lower)
            if score > 0:
                subject_scores[subject] = score
        
        if subject_scores:
            return max(subject_scores, key=subject_scores.get)
        return None

    def _build_conversation_context(self, current_message: str, history: List[ChatMessage], 
                                  user_level: str, subject: Optional[str]) -> List[Dict[str, str]]:
        """Build the conversation context for OpenAI API"""
        messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add level-specific context
        level_context = f"\nThe student is at {user_level} level."
        if subject:
            level_context += f" They are asking about {subject}."
        level_context += " Please adjust your explanation accordingly.\n"
        
        messages[0]["content"] += level_context
        
        # Add conversation history (limit to last 10 messages to stay within token limits)
        for msg in history[-10:]:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Add current message
        messages.append({
            "role": "user",
            "content": current_message
        })
        
        return messages

    async def _call_openai(self, messages: List[Dict[str, str]]) -> str:
        """Make API call to OpenAI with fallback"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=500,
                temperature=0.7,
                presence_penalty=0.1,
                frequency_penalty=0.1
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"⚠️ OpenAI API unavailable: {e}")
            # Return fallback response
            return self._generate_fallback_response(messages)

    def _extract_suggestions(self, response: str, subject: Optional[str]) -> List[str]:
        """Extract follow-up suggestions based on the response and subject"""
        suggestions = []
        
        # Generic educational suggestions
        generic_suggestions = [
            "Would you like me to explain this concept differently?",
            "Do you have any follow-up questions?",
            "Would you like to see a practice problem?",
            "Should we explore related topics?"
        ]
        
        # Subject-specific suggestions
        subject_suggestions = {
            "mathematics": [
                "Would you like to see step-by-step solving examples?",
                "Should we practice with similar problems?",
                "Would you like to learn about related mathematical concepts?"
            ],
            "science": [
                "Would you like to see real-world applications?",
                "Should we explore the underlying principles?",
                "Would you like to learn about related scientific phenomena?"
            ],
            "computer_science": [
                "Would you like to see code examples?",
                "Should we walk through the algorithm step by step?",
                "Would you like to learn about related programming concepts?"
            ]
        }
        
        # Add 2 relevant suggestions
        if subject and subject in subject_suggestions:
            suggestions.extend(subject_suggestions[subject][:2])
        else:
            suggestions.extend(generic_suggestions[:2])
        
        return suggestions
    
    def _generate_fallback_response(self, messages: List[Dict[str, str]]) -> str:
        """Generate a fallback response when OpenAI is unavailable"""
        # Get the user's last message
        user_message = messages[-1]["content"] if messages else "Hello"
        
        # Detect subject from the message
        detected_subject = self._detect_subject(user_message)
        
        # Subject-specific fallback responses
        fallback_responses = {
            "mathematics": "🔢 I'd love to help with your math question! While my advanced AI features are temporarily unavailable, I can offer some general math guidance: Break down complex problems into smaller steps, identify what you know and what you need to find, and choose the appropriate formulas or methods. Would you like me to suggest some math resources or study techniques?",
            
            "physics": "⚛️ Great physics question! Even though I'm running in simplified mode, I can share that physics problems often involve: drawing diagrams, identifying known and unknown variables, applying relevant laws and equations, and checking your units. Physics is about understanding how things work - would you like some study tips for your specific physics topic?",
            
            "chemistry": "🧪 Chemistry is fascinating! While my full AI capabilities are temporarily down, I can remind you that chemistry success often comes from: understanding the periodic table, balancing equations, paying attention to significant figures, and practicing molecular structures. What specific chemistry concept are you working on?",
            
            "biology": "🧬 Biology is the study of life! Though I'm in basic mode right now, I can suggest focusing on: key vocabulary, structure-function relationships, biological processes at different scales, and real-world connections. Biology concepts often build on each other - are you studying a particular system or process?",
            
            "computer_science": "💻 Programming and computer science are exciting! Even in simplified mode, I can remind you that good coding involves: breaking problems into smaller parts, planning your algorithm, writing clean code, testing thoroughly, and debugging systematically. What programming concept or language are you working with?",
            
            "english": "📝 Language and literature are rich subjects! While my advanced features are temporarily unavailable, remember that English success comes from: active reading, analyzing themes and literary devices, regular writing practice, vocabulary building, and discussion. What aspect of English are you exploring?",
            
            "history": "📜 History helps us understand our world! Though I'm running in basic mode, good history study involves: creating timelines, understanding cause and effect, considering multiple perspectives, using primary sources, and connecting past to present. What historical period or event interests you?",
            
            "geography": "🌍 Geography connects the physical and human worlds! Even in simplified mode, I can suggest focusing on: map skills, understanding physical and human geography connections, climate patterns, and spatial relationships. What geographic concept are you studying?"
        }
        
        # Get appropriate response
        if detected_subject and detected_subject in fallback_responses:
            response = fallback_responses[detected_subject]
        else:
            response = "📚 I'm here to help with your learning! While my advanced AI features are temporarily unavailable due to connectivity issues, I can still provide educational guidance and study tips. Please let me know what subject you're working on, and I'll do my best to help guide your learning process!"
        
        # Add offline notice
        offline_notice = "⚠️ Currently running in offline mode - my advanced AI features will return when connectivity is restored.\n\n"
        
        return offline_notice + response

    def validate_educational_content(self, message: str) -> bool:
        """Validate if the message is educational in nature"""
        non_educational_keywords = [
            "weather", "sports", "entertainment", "gossip", "personal problems",
            "relationship", "dating", "politics", "religion", "gambling"
        ]
        
        message_lower = message.lower()
        return not any(keyword in message_lower for keyword in non_educational_keywords)
