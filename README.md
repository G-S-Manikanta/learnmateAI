# LearnMate AI Frontend

A modern Angular-based student dashboard application that provides an AI-powered learning platform for academic success.

## 🚀 Features

- **🏠 Home Page**: Welcome page with featured tutorials and subject exploration
- **🔐 Authentication**: Secure login/logout with JWT tokens and route guards
- **📊 Student Dashboard**: Personalized dashboard with study stats and progress tracking
- **🤖 AI Study Companion**: Interactive AI-powered learning assistant
- **📈 Analytics**: Comprehensive learning analytics and progress insights
- **📚 Tutorial Management**: Browse, track, and complete educational content
- **🎯 Goal Tracking**: Set and monitor learning objectives
- **🏆 Achievements**: Gamified learning with badges and milestones

## 🛠️ Technologies Used

- **Frontend Framework**: Angular 17+
- **Language**: TypeScript
- **Styling**: CSS3 with custom design system
- **State Management**: RxJS with BehaviorSubjects
- **Routing**: Angular Router with guards
- **Forms**: Angular Reactive Forms
- **HTTP Client**: Angular HttpClient

## 🚀 Getting Started

### Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npm run build
# or
ng build
```

The build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
src/app/
├── components/           # UI Components
│   ├── home/            # Landing page
│   ├── login/           # Authentication
│   ├── dashboard/       # Student dashboard
│   ├── study-companion/ # AI companion
│   └── analytics/       # Progress analytics
├── services/            # Business Logic
│   ├── auth.service.ts  # Authentication
│   ├── user.service.ts  # User management
│   ├── tutorial.service.ts # Tutorial operations
│   └── analytics.service.ts # Analytics data
├── models/              # TypeScript Interfaces
│   ├── user.model.ts    # User types
│   ├── tutorial.model.ts # Tutorial types
│   └── analytics.model.ts # Analytics types
├── guards/              # Route Protection
│   ├── auth.guard.ts    # Authentication guard
│   └── admin.guard.ts   # Admin access guard
└── app.routes.ts        # Application routing
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests

## 🚀 Quick Demo

For testing purposes, you can use the demo login:
- Email: demo@learnmate.com
- Password: demo123

## 📝 Development Notes

This project follows Angular best practices:
- Standalone components for better tree-shaking
- Reactive forms for form handling
- TypeScript strict mode for type safety
- Route guards for authentication
- Service-based architecture for state management

---

Generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.
