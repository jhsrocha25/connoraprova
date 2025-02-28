
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  progress?: number;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  content: ModuleContent[];
  isCompleted?: boolean;
}

export interface ModuleContent {
  id: string;
  type: 'pdf' | 'interactive';
  title: string;
  url: string;
  duration?: string;
  isCompleted?: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface UserProgress {
  userId: string;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questionsHistory: Question[];
  courseProgress: {
    courseId: string;
    progress: number;
    lastAccessed: Date;
  }[];
  performanceByCategory: {
    category: string;
    correctPercentage: number;
    questionsAttempted: number;
  }[];
  streak: number;
  lastActive: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'admin';
  joinedDate: Date;
  progress: UserProgress;
}
