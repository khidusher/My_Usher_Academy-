
export enum Difficulty {
  BEGINNER = 'Beginner',
  EXPLORER = 'Explorer',
  CHAMPION = 'Champion'
}

export interface Lesson {
  id: string;
  title: string;
  region: string;
  description: string;
  concept: string;
  example: string;
  challenge: string;
  initialCode: string;
  solution: string;
  testCases: { input?: string; expected: string; hint: string }[];
  xp: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LevelQuiz {
  levelId: string;
  levelName: string;
  questions: QuizQuestion[];
}

export interface UserProgress {
  name: string;
  password?: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  completedLessons: string[];
  completedQuizzes: string[];
  badges: Badge[];
  lastActiveLessonId?: string;
  autosaveCode: Record<string, string>;
  dailyGoal: number; // New: Number of lessons targeted per day
  todayCompletedCount: number; // New: Lessons finished today
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
