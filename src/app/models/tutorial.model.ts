export interface Tutorial {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // in minutes
  thumbnail?: string;
  content: TutorialContent[];
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  rating: number;
  totalRatings: number;
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface TutorialContent {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  order: number;
  resources?: Resource[];
}

export enum ContentType {
  TEXT = 'text',
  VIDEO = 'video',
  QUIZ = 'quiz',
  EXERCISE = 'exercise',
  READING = 'reading'
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  url: string;
  description?: string;
}

export enum ResourceType {
  PDF = 'pdf',
  LINK = 'link',
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image'
}

export interface TutorialProgress {
  userId: string;
  tutorialId: string;
  currentContentId: string;
  completedContentIds: string[];
  progressPercentage: number;
  timeSpent: number; // in minutes
  lastAccessed: Date;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface Quiz {
  id: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay'
}
