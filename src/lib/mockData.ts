// Mock data for demo mode
import { User } from '@supabase/supabase-js';

export interface MockStudent {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  avatar_url?: string;
  level: number;
  xp: number;
  streak_days: number;
  total_lessons_completed: number;
  badges_earned: number;
  created_at: string;
}

export interface MockBadge {
  id: string;
  student_id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface MockLesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration_minutes: number;
  xp_reward: number;
}

// Demo student profiles
export const demoStudents: any[] = [
  {
    id: 'student-1',
    parent_id: 'parent-demo',
    name: 'Alex',
    display_name: 'Alex',
    age: 10,
    avatar_url: '👦',
    level: 5,
    current_level: 5,
    xp: 2450,
    current_xp: 2450,
    experience_points: 2450,
    projects_completed: 5,
    total_hours_coded: 24.5,
    streak_days: 7,
    total_lessons_completed: 23,
    badges_earned: 8,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    last_active_at: new Date().toISOString()
  },
  {
    id: 'student-2',
    parent_id: 'parent-demo',
    name: 'Emma',
    display_name: 'Emma',
    age: 8,
    avatar_url: '👧',
    level: 3,
    current_level: 3,
    xp: 1200,
    current_xp: 1200,
    experience_points: 1200,
    projects_completed: 2,
    total_hours_coded: 12.5,
    streak_days: 3,
    total_lessons_completed: 12,
    badges_earned: 4,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_active_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Demo badges
export const demoBadges: MockBadge[] = [
  {
    id: 'badge-1',
    student_id: 'student-1',
    name: 'First Steps',
    description: 'Completed your first lesson',
    icon: '🎯',
    earned_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'badge-2',
    student_id: 'student-1',
    name: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: '🔥',
    earned_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'badge-3',
    student_id: 'student-1',
    name: 'Python Pioneer',
    description: 'Completed first Python course',
    icon: '🐍',
    earned_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'badge-4',
    student_id: 'student-1',
    name: 'Code Master',
    description: 'Solved 20 coding challenges',
    icon: '⚡',
    earned_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Demo lessons
export const demoLessons: MockLesson[] = [
  {
    id: 'lesson-1',
    title: 'Introduction to Python',
    description: 'Learn the basics of Python programming',
    difficulty: 'beginner',
    category: 'Python',
    duration_minutes: 30,
    xp_reward: 100
  },
  {
    id: 'lesson-2',
    title: 'Variables and Data Types',
    description: 'Master variables, strings, numbers, and booleans',
    difficulty: 'beginner',
    category: 'Python',
    duration_minutes: 45,
    xp_reward: 150
  },
  {
    id: 'lesson-3',
    title: 'Loops and Conditionals',
    description: 'Control program flow with if statements and loops',
    difficulty: 'intermediate',
    category: 'Python',
    duration_minutes: 60,
    xp_reward: 200
  },
  {
    id: 'lesson-4',
    title: 'Build Your First Game',
    description: 'Create a fun number guessing game',
    difficulty: 'intermediate',
    category: 'Projects',
    duration_minutes: 90,
    xp_reward: 300
  },
  {
    id: 'lesson-5',
    title: 'Introduction to AI',
    description: 'Learn what AI is and build your first chatbot',
    difficulty: 'advanced',
    category: 'AI',
    duration_minutes: 120,
    xp_reward: 500
  }
];

// Demo user profiles
export const demoParentUser = {
  id: 'parent-demo',
  email: 'demo@codekid.com',
  role: 'parent',
  full_name: 'Demo Parent',
  created_at: new Date().toISOString()
};

export const demoStudentUser = {
  id: 'student-1',
  email: 'alex@demo.com',
  role: 'student',
  full_name: 'Alex Demo',
  created_at: new Date().toISOString()
};

// Weekly activity data - matches DailyActivity type
export const demoWeeklyActivity = [
  { activity_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes_active: 45, lessons_completed: 2, xp_earned: 150 },
  { activity_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes_active: 60, lessons_completed: 3, xp_earned: 200 },
  { activity_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes_active: 30, lessons_completed: 1, xp_earned: 100 },
  { activity_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes_active: 75, lessons_completed: 4, xp_earned: 250 },
  { activity_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes_active: 50, lessons_completed: 2, xp_earned: 150 },
  { activity_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], minutes_active: 90, lessons_completed: 5, xp_earned: 350 },
  { activity_date: new Date().toISOString().split('T')[0], minutes_active: 40, lessons_completed: 2, xp_earned: 120 }
];

// Demo AI chat messages
export const demoAIChatMessages = [
  {
    id: '1',
    role: 'assistant' as const,
    content: "Hi there! I'm your AI coding mentor. I'm here to help you learn and answer any questions you have. What would you like to learn today?",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
];
