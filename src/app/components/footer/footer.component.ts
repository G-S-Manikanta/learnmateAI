import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  currentQuote = '';
  studyStreak = 5; // This would come from analytics service in real app
  
  motivationalQuotes = [
    "🚀 Keep learning, one step at a time!",
    "💪 You're doing great! Every lesson counts.",
    "🌟 Knowledge is power, and you're building it daily!",
    "🎯 Focus on progress, not perfection.",
    "📚 Today's learning is tomorrow's success!",
    "🔥 Your dedication is inspiring!",
    "⭐ Small steps lead to big achievements!",
    "🎓 Education is the key to unlocking your potential!",
    "💡 Every expert was once a beginner!",
    "🌈 Learning never exhausts the mind!"
  ];

  quickLinks = [
    { path: '/about', label: 'About', icon: '📘' },
    { path: '/support', label: 'Contact Support', icon: '🛠️' },
    { path: '/privacy', label: 'Privacy & Terms', icon: '🔐' },
    { path: '/help', label: 'Help Center', icon: '❓' }
  ];

  socialLinks = [
    { url: 'https://twitter.com/learnmate', icon: '🐦', label: 'Twitter' },
    { url: 'https://linkedin.com/company/learnmate', icon: '💼', label: 'LinkedIn' },
    { url: 'https://youtube.com/learnmate', icon: '🎥', label: 'YouTube' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.rotateQuote();
    // Rotate quote every 30 seconds
    setInterval(() => {
      this.rotateQuote();
    }, 30000);
  }

  private rotateQuote(): void {
    const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
    this.currentQuote = this.motivationalQuotes[randomIndex];
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
