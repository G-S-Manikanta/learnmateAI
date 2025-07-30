export interface AnalyticsData {
  userId: string;
  studyStats: StudyStats;
  performanceMetrics: PerformanceMetrics;
  learningProgress: LearningProgress;
  timeAnalytics: TimeAnalytics;
  subjectAnalytics: SubjectAnalytics[];
}

export interface StudyStats {
  totalStudyTime: number; // in minutes
  averageSessionDuration: number; // in minutes
  studyStreak: number; // consecutive days
  longestStreak: number; // longest consecutive days
  totalSessions: number;
  completedTutorials: number;
  inProgressTutorials: number;
}

export interface PerformanceMetrics {
  overallScore: number; // percentage
  averageQuizScore: number; // percentage
  totalQuizzesTaken: number;
  totalQuizzesPassed: number;
  improvementRate: number; // percentage
  strongSubjects: string[];
  weakSubjects: string[];
}

export interface LearningProgress {
  currentLevel: LearningLevel;
  experiencePoints: number;
  nextLevelProgress: number; // percentage to next level
  badges: Badge[];
  achievements: Achievement[];
  milestones: Milestone[];
}

export enum LearningLevel {
  NOVICE = 'novice',
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: BadgeCategory;
}

export enum BadgeCategory {
  STUDY_TIME = 'study_time',
  QUIZ_PERFORMANCE = 'quiz_performance',
  STREAK = 'streak',
  COMPLETION = 'completion',
  SPECIAL = 'special'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  points: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: Date;
  category: MilestoneCategory;
}

export enum MilestoneCategory {
  STUDY_HOURS = 'study_hours',
  TUTORIALS_COMPLETED = 'tutorials_completed',
  QUIZ_SCORE = 'quiz_score',
  STREAK_DAYS = 'streak_days'
}

export interface TimeAnalytics {
  dailyStudyTime: DailyStudyTime[];
  weeklyStudyTime: WeeklyStudyTime[];
  monthlyStudyTime: MonthlyStudyTime[];
  peakStudyHours: number[];
  studyPattern: StudyPattern;
}

export interface DailyStudyTime {
  date: Date;
  minutes: number;
  sessionsCount: number;
}

export interface WeeklyStudyTime {
  weekStart: Date;
  totalMinutes: number;
  averageDailyMinutes: number;
  activeDays: number;
}

export interface MonthlyStudyTime {
  month: number;
  year: number;
  totalMinutes: number;
  averageDailyMinutes: number;
  activeDays: number;
}

export enum StudyPattern {
  MORNING_PERSON = 'morning_person',
  AFTERNOON_LEARNER = 'afternoon_learner',
  EVENING_STUDIER = 'evening_studier',
  NIGHT_OWL = 'night_owl',
  CONSISTENT = 'consistent',
  IRREGULAR = 'irregular'
}

export interface SubjectAnalytics {
  subject: string;
  totalStudyTime: number; // in minutes
  completedTutorials: number;
  averageScore: number; // percentage
  progressPercentage: number;
  lastStudied: Date;
  difficulty: DifficultyLevel;
  recommendedNextSteps: string[];
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}
