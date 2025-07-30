import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface TutorRequest {
  message: string;
  conversation_history?: ChatMessage[];
  subject?: string;
  user_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface TutorResponse {
  response: string;
  suggestions?: string[];
  subject_detected?: string;
  confidence?: number;
  timestamp: Date;
}

export interface Subject {
  name: string;
  topics: string[];
  icon: string;
}

export interface StudyTip {
  category: string;
  tip: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiTutorService {
  private baseUrl = 'http://localhost:8000/api/tutor';
  private conversationHistory: ChatMessage[] = [];
  private conversationSubject = new BehaviorSubject<ChatMessage[]>([]);
  private isTypingSubject = new BehaviorSubject<boolean>(false);
  private connectionStatusSubject = new BehaviorSubject<'online' | 'offline'>('online');

  // Observables for components to subscribe to
  conversation$ = this.conversationSubject.asObservable();
  isTyping$ = this.isTypingSubject.asObservable();
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize with welcome message
    this.addWelcomeMessage();
  }

  private addWelcomeMessage(): void {
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: `Hello! I'm your LearnMate AI Tutor! 🎓 

I'm here to help you with your studies. I can assist you with:
• Mathematics (algebra, calculus, geometry, statistics)
• Science (physics, chemistry, biology)
• Computer Science (programming, algorithms)
• English (grammar, literature, writing)
• And much more!

What would you like to learn about today?`,
      timestamp: new Date()
    };
    
    this.conversationHistory = [welcomeMessage];
    this.conversationSubject.next([...this.conversationHistory]);
  }

  async sendMessage(
    message: string, 
    subject?: string, 
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<TutorResponse> {
    try {
      // Add user message to conversation
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      
      this.conversationHistory.push(userMessage);
      this.conversationSubject.next([...this.conversationHistory]);
      
      // Show typing indicator
      this.isTypingSubject.next(true);

      // Prepare request with conversation history in the correct format
      const conversationHistory = this.conversationHistory
        .slice(-10) // Last 10 messages for context
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const request: TutorRequest = {
        message,
        conversation_history: conversationHistory,
        subject,
        user_level: userLevel
      };

      // Send to backend
      const response = await this.http.post<TutorResponse>(`${this.baseUrl}/chat`, request).toPromise();
      
      if (response) {
        // Update connection status if successful
        this.connectionStatusSubject.next('online');
        
        // Add assistant response to conversation
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.response,
          timestamp: new Date(response.timestamp)
        };
        
        this.conversationHistory.push(assistantMessage);
        this.conversationSubject.next([...this.conversationHistory]);
        
        return response;
      }
      
      throw new Error('No response received');
      
    } catch (error) {
      console.error('Error sending message to AI tutor:', error);
      
      // Update connection status
      this.connectionStatusSubject.next('offline');
      
      // Add error message to conversation
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '⚠️ I\'m having trouble connecting to my backend services right now. Please make sure the LearnMate AI backend server is running on localhost:8000. You can start it by running the Python backend from the backend folder. Let me know if you need help! �',
        timestamp: new Date()
      };
      
      this.conversationHistory.push(errorMessage);
      this.conversationSubject.next([...this.conversationHistory]);
      
      throw error;
    } finally {
      // Hide typing indicator
      this.isTypingSubject.next(false);
    }
  }

  async getAvailableSubjects(): Promise<{ subjects: Record<string, Subject> }> {
    try {
      const response = await this.http.get<{ subjects: Record<string, Subject> }>(`${this.baseUrl}/subjects`).toPromise();
      return response || { subjects: {} };
    } catch (error) {
      console.error('Error fetching subjects:', error);
      this.connectionStatusSubject.next('offline');
      return { subjects: this.getFallbackSubjects() };
    }
  }

  async getStudyTips(): Promise<{ tips: StudyTip[] }> {
    try {
      const response = await this.http.get<{ tips: StudyTip[] }>(`${this.baseUrl}/study-tips`).toPromise();
      return response || { tips: [] };
    } catch (error) {
      console.error('Error fetching study tips:', error);
      this.connectionStatusSubject.next('offline');
      return { tips: this.getFallbackStudyTips() };
    }
  }

  clearConversation(): void {
    this.conversationHistory = [];
    this.conversationSubject.next([]);
    this.addWelcomeMessage();
  }

  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  exportConversation(): string {
    return this.conversationHistory
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
  }

  // Fallback data in case backend is not available
  private getFallbackSubjects(): Record<string, Subject> {
    return {
      mathematics: {
        name: "Mathematics",
        topics: ["Algebra", "Calculus", "Geometry", "Statistics"],
        icon: "🔢"
      },
      physics: {
        name: "Physics",
        topics: ["Mechanics", "Thermodynamics", "Electricity", "Waves"],
        icon: "⚛️"
      },
      chemistry: {
        name: "Chemistry",
        topics: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
        icon: "🧪"
      },
      biology: {
        name: "Biology",
        topics: ["Cell Biology", "Genetics", "Evolution", "Ecology"],
        icon: "🧬"
      },
      computer_science: {
        name: "Computer Science",
        topics: ["Programming", "Algorithms", "Data Structures", "Databases"],
        icon: "💻"
      }
    };
  }

  private getFallbackStudyTips(): StudyTip[] {
    return [
      {
        category: "Time Management",
        tip: "Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break",
        icon: "⏰"
      },
      {
        category: "Active Learning",
        tip: "Teach concepts to someone else or explain them out loud to reinforce understanding",
        icon: "🗣️"
      },
      {
        category: "Note Taking",
        tip: "Use the Cornell Note-Taking System to organize and review your notes effectively",
        icon: "📝"
      }
    ];
  }

  // Utility method to detect if backend is available
  async checkBackendHealth(): Promise<boolean> {
    try {
      await this.http.get(`http://localhost:8000/health`).toPromise();
      return true;
    } catch {
      return false;
    }
  }
}
