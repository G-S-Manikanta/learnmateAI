import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AiTutorService, ChatMessage, TutorResponse } from '../../services/ai-tutor.service';

@Component({
  selector: 'app-ai-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-tutor-container">
      <div class="ai-tutor-header">
        <h1>🤖 LearnMate AI Tutor</h1>
        <p>Get personalized help and guidance from your AI learning assistant</p>
        <div class="connection-status" [class.offline]="connectionStatus === 'offline'">
          <span class="status-indicator" [class.offline]="connectionStatus === 'offline'"></span>
          {{ connectionStatus === 'online' ? 'Connected' : 'Offline Mode' }}
        </div>
      </div>
      
      <div class="ai-tutor-content">
        <div class="chat-container">
          <div class="chat-messages" #messagesContainer>
            <div *ngFor="let message of conversation" 
                 class="message" 
                 [class.user-message]="message.role === 'user'"
                 [class.ai-message]="message.role === 'assistant'">
              <div class="message-avatar">
                {{ message.role === 'user' ? '👤' : '🤖' }}
              </div>
              <div class="message-content">
                <p [innerHTML]="formatMessage(message.content)"></p>
                <small class="message-time">{{ formatTime(message.timestamp) }}</small>
              </div>
            </div>
            
            <div *ngIf="isTyping" class="message ai-message typing">
              <div class="message-avatar">🤖</div>
              <div class="message-content">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chat-input-container">
            <input 
              type="text" 
              [(ngModel)]="currentMessage"
              (keyup.enter)="sendMessage()"
              placeholder="Ask me anything about your studies..." 
              class="chat-input"
              [disabled]="isTyping">
            <select [(ngModel)]="selectedSubject" class="subject-select">
              <option value="">Select Subject</option>
              <option *ngFor="let subject of availableSubjects | keyvalue" [value]="subject.key">
                {{ getSubjectDisplay(subject.value) }}
              </option>
            </select>
            <button 
              (click)="sendMessage()" 
              class="send-button"
              [disabled]="!currentMessage.trim() || isTyping">
              Send
            </button>
          </div>
        </div>
        
        <div class="ai-features">
          <h3>What I can help you with:</h3>
          <div class="feature-grid">
            <div class="feature-card" *ngFor="let subject of featuredSubjects" (click)="selectSubjectExample(subject.key)">
              <span class="feature-icon">{{ getSubjectIcon(subject.value) }}</span>
              <h4>{{ getSubjectName(subject.value) }}</h4>
              <p>{{ getSubjectTopics(subject.value) }}</p>
            </div>
          </div>
          
          <div class="study-tips" *ngIf="studyTips.length > 0">
            <h3>💡 Study Tips</h3>
            <div class="tip-card" *ngFor="let tip of studyTips.slice(0, 3)">
              <span class="tip-icon">{{ tip.icon }}</span>
              <div>
                <strong>{{ tip.category }}</strong>
                <p>{{ tip.tip }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ai-tutor-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .ai-tutor-header {
      text-align: center;
      color: white;
      margin-bottom: 30px;
    }

    .connection-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 10px;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #4ade80;
      animation: pulse 2s infinite;
    }

    .status-indicator.offline {
      background-color: #f87171;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .ai-tutor-header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    
    .ai-tutor-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }
    
    .chat-container {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      flex-direction: column;
      height: 600px;
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 20px;
    }
    
    .message {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    
    .message-content {
      background: rgba(255, 255, 255, 0.1);
      padding: 15px 20px;
      border-radius: 15px;
      color: white;
      flex: 1;
    }
    
    .chat-input-container {
      display: flex;
      gap: 10px;
    }
    
    .chat-input {
      flex: 1;
      padding: 15px 20px;
      border: none;
      border-radius: 25px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1rem;
      outline: none;
    }
    
    .chat-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
    
    .send-button {
      padding: 15px 25px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .send-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .ai-features {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 25px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .ai-features h3 {
      color: white;
      margin-bottom: 20px;
      font-size: 1.3rem;
    }
    
    .feature-grid {
      display: grid;
      gap: 15px;
    }
    
    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 15px;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-3px);
      background: rgba(255, 255, 255, 0.15);
    }
    
    .feature-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 10px;
    }
    
    .feature-card h4 {
      color: white;
      margin-bottom: 8px;
      font-size: 1.1rem;
    }
    
    .feature-card p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .ai-tutor-content {
        grid-template-columns: 1fr;
      }
      
      .chat-container {
        height: 400px;
      }

      .typing-indicator {
        display: flex;
        gap: 4px;
        align-items: center;
      }

      .typing-indicator span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #6366f1;
        animation: typing 1.4s infinite;
      }

      .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }

      .subject-select {
        padding: 10px;
        border: none;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        min-width: 120px;
      }

      .subject-select option {
        background: #1f2937;
        color: white;
      }

      .message-time {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.75rem;
        margin-top: 5px;
        display: block;
      }

      .user-message .message-time {
        color: rgba(0, 0, 0, 0.6);
      }

      .study-tips {
        margin-top: 20px;
      }

      .tip-card {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        background: rgba(255, 255, 255, 0.1);
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 10px;
      }

      .tip-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
      }

      .tip-card strong {
        display: block;
        margin-bottom: 5px;
        color: white;
      }

      .tip-card p {
        margin: 0;
        font-size: 0.9rem;
        opacity: 0.9;
      }

      .feature-card {
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .feature-card:hover {
        transform: translateY(-2px);
      }
    }
  `]
})
export class AiTutorComponent implements OnInit, OnDestroy {
  conversation: ChatMessage[] = [];
  currentMessage: string = '';
  isTyping: boolean = false;
  connectionStatus: 'online' | 'offline' = 'online';
  selectedSubject: string = '';
  availableSubjects: any = {};
  studyTips: any[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(private aiTutorService: AiTutorService) {}

  ngOnInit(): void {
    // Subscribe to conversation updates
    this.subscriptions.push(
      this.aiTutorService.conversation$.subscribe(conversation => {
        this.conversation = conversation;
        this.scrollToBottom();
      })
    );

    // Subscribe to typing indicator
    this.subscriptions.push(
      this.aiTutorService.isTyping$.subscribe(isTyping => {
        this.isTyping = isTyping;
        if (isTyping) {
          setTimeout(() => this.scrollToBottom(), 100);
        }
      })
    );

    // Subscribe to connection status
    this.subscriptions.push(
      this.aiTutorService.connectionStatus$.subscribe(status => {
        this.connectionStatus = status;
      })
    );

    // Load subjects and study tips
    this.loadSubjects();
    this.loadStudyTips();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async sendMessage(): Promise<void> {
    if (!this.currentMessage.trim() || this.isTyping) return;

    const message = this.currentMessage.trim();
    this.currentMessage = '';

    try {
      await this.aiTutorService.sendMessage(message, this.selectedSubject || undefined);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async loadSubjects(): Promise<void> {
    try {
      const response = await this.aiTutorService.getAvailableSubjects();
      this.availableSubjects = response.subjects;
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  }

  async loadStudyTips(): Promise<void> {
    try {
      const response = await this.aiTutorService.getStudyTips();
      this.studyTips = response.tips;
    } catch (error) {
      console.error('Error loading study tips:', error);
    }
  }

  selectSubjectExample(subject: string): void {
    this.selectedSubject = subject;
    const examples = {
      'mathematics': 'Can you help me understand quadratic equations?',
      'physics': 'Explain how photosynthesis works at the molecular level.',
      'chemistry': 'What is the difference between ionic and covalent bonds?',
      'biology': 'How does DNA replication work?',
      'computer_science': 'Explain object-oriented programming concepts.',
      'english': 'Help me analyze themes in Shakespeare\'s Hamlet.',
      'history': 'What were the main causes of World War I?',
      'geography': 'Explain the water cycle and its importance.'
    };
    
    this.currentMessage = examples[subject as keyof typeof examples] || `Tell me about ${subject}`;
  }

  formatMessage(content: string): string {
    // Simple formatting for line breaks and basic markdown
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  formatTime(timestamp?: Date): string {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  get featuredSubjects() {
    const subjects = Object.entries(this.availableSubjects);
    return subjects.slice(0, 4).map(([key, value]) => ({ key, value }));
  }

  getSubjectDisplay(subject: any): string {
    return `${subject.icon || '📚'} ${subject.name || 'Subject'}`;
  }

  getSubjectIcon(subject: any): string {
    return subject.icon || '📚';
  }

  getSubjectName(subject: any): string {
    return subject.name || 'Subject';
  }

  getSubjectTopics(subject: any): string {
    if (subject.topics && Array.isArray(subject.topics)) {
      return subject.topics.slice(0, 2).join(', ');
    }
    return 'Various topics';
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.chat-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
