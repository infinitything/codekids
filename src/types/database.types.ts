/**
 * CODEKID - Comprehensive Database Types
 * Auto-generated from Supabase schema
 */

export type UserRole = 'parent' | 'student' | 'instructor' | 'admin';
export type SubscriptionTier = 'free' | 'premium' | 'family' | 'lifetime';
export type AgeGroup = '5-8' | '8-12' | '12-16';
export type LessonType = 'visual' | 'code' | 'ai_ml' | 'project';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type BadgeCategory = 'achievement' | 'milestone' | 'skill' | 'special';

// =====================================================
// CORE USER TYPES
// =====================================================

export interface Parent {
  id: string;
  auth_id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  subscription_tier: SubscriptionTier;
  subscription_start_date?: string;
  subscription_end_date?: string;
  stripe_customer_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  email_verified: boolean;
  two_factor_enabled: boolean;
}

export interface Student {
  id: string;
  parent_id: string;
  username: string;
  display_name: string;
  age: number;
  age_group: AgeGroup;
  date_of_birth: string;
  avatar_url: string;
  theme_preference: string;
  experience_points: number;
  current_level: number;
  streak_days: number;
  last_activity_date?: string;
  total_hours_coded: number;
  projects_completed: number;
  badges_earned: number;
  preferred_learning_style?: string;
  interests?: string[];
  coppa_consent: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Instructor {
  id: string;
  auth_id: string;
  email: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  specializations?: string[];
  rating: number;
  total_sessions: number;
  hourly_rate?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  auth_id: string;
  email: string;
  full_name: string;
  permissions?: string[];
  created_at: string;
}

// =====================================================
// CURRICULUM TYPES
// =====================================================

export interface LearningTrack {
  id: string;
  title: string;
  description?: string;
  age_group: AgeGroup;
  difficulty_level: DifficultyLevel;
  estimated_hours?: number;
  sequence_order?: number;
  thumbnail_url?: string;
  icon_name?: string;
  color_theme?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  track_id: string;
  title: string;
  description?: string;
  lesson_type: LessonType;
  difficulty_level: DifficultyLevel;
  sequence_order: number;
  estimated_minutes?: number;
  content_blocks?: ContentBlock[];
  video_url?: string;
  video_duration?: number;
  starter_code?: string;
  solution_code?: string;
  hints?: Hint[];
  learning_objectives?: string[];
  prerequisites?: string[];
  xp_reward: number;
  thumbnail_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  type: 'text' | 'code' | 'video' | 'interactive' | 'quiz' | 'image';
  content: string;
  metadata?: Record<string, any>;
  order: number;
}

export interface Hint {
  level: number; // 1-5, progressive hints
  text: string;
  code_snippet?: string;
}

export interface Challenge {
  id: string;
  lesson_id: string;
  title: string;
  description?: string;
  challenge_type: 'coding' | 'quiz' | 'drag_drop' | 'fill_blank';
  difficulty_level?: DifficultyLevel;
  question_data: QuestionData;
  test_cases?: TestCase[];
  correct_answer?: any;
  points: number;
  time_limit_seconds?: number;
  sequence_order?: number;
  active: boolean;
  created_at: string;
}

export interface QuestionData {
  question: string;
  options?: string[];
  code_template?: string;
  expected_output?: string;
  [key: string]: any;
}

export interface TestCase {
  input: string;
  expected_output: string;
  is_hidden: boolean;
  points: number;
}

// =====================================================
// PROGRESS TRACKING TYPES
// =====================================================

export interface TrackEnrollment {
  id: string;
  student_id: string;
  track_id: string;
  progress_percentage: number;
  started_at: string;
  completed_at?: string;
  current_lesson_id?: string;
  total_time_spent: number;
}

export interface LessonProgress {
  id: string;
  student_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  attempts: number;
  time_spent_seconds: number;
  accuracy_score?: number;
  completion_time_seconds?: number;
  hints_used: number;
  student_code?: string;
  last_code_snapshot?: string;
  started_at?: string;
  completed_at?: string;
  last_accessed: string;
}

export interface ChallengeAttempt {
  id: string;
  student_id: string;
  challenge_id: string;
  submitted_answer: any;
  is_correct: boolean;
  score: number;
  time_taken_seconds: number;
  hints_used: number;
  created_at: string;
}

// =====================================================
// GAMIFICATION TYPES
// =====================================================

export interface Badge {
  id: string;
  name: string;
  description?: string;
  category?: BadgeCategory;
  icon_url?: string;
  color?: string;
  criteria: BadgeCriteria;
  points_value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  active: boolean;
  created_at: string;
}

export interface BadgeCriteria {
  type: string;
  count?: number;
  [key: string]: any;
}

export interface StudentBadge {
  id: string;
  student_id: string;
  badge_id: string;
  awarded_at: string;
}

export interface Achievement {
  id: string;
  student_id: string;
  achievement_type: string;
  achievement_data?: Record<string, any>;
  xp_earned?: number;
  created_at: string;
}

export interface DailyActivity {
  id: string;
  student_id: string;
  activity_date: string;
  minutes_active: number;
  lessons_completed: number;
  challenges_completed: number;
  xp_earned: number;
}

export interface LeaderboardEntry {
  id: string;
  student_id: string;
  leaderboard_type: 'weekly_xp' | 'monthly_projects' | 'all_time';
  rank: number;
  score: number;
  period_start?: string;
  period_end?: string;
  created_at: string;
}

// =====================================================
// PROJECT & PORTFOLIO TYPES
// =====================================================

export interface Project {
  id: string;
  student_id: string;
  lesson_id?: string;
  title: string;
  description?: string;
  project_type: 'game' | 'website' | 'ai_model' | 'chatbot' | 'visualization' | 'other';
  code_files?: Record<string, string>;
  assets_urls?: string[];
  demo_url?: string;
  github_url?: string;
  thumbnail_url?: string;
  tags?: string[];
  is_public: boolean;
  is_featured: boolean;
  views: number;
  likes: number;
  forks: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ProjectLike {
  id: string;
  project_id: string;
  student_id: string;
  created_at: string;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  student_id: string;
  parent_comment_id?: string;
  content: string;
  is_flagged: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// AI MENTOR TYPES
// =====================================================

export interface AIConversation {
  id: string;
  student_id: string;
  lesson_id?: string;
  conversation_history: ConversationMessage[];
  context_data?: ConversationContext;
  total_messages: number;
  student_satisfaction_rating?: number;
  flagged_for_review: boolean;
  escalated_to_human: boolean;
  started_at: string;
  ended_at?: string;
  last_message_at: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ConversationContext {
  current_lesson?: string;
  current_code?: string;
  error_message?: string;
  student_level?: number;
  struggle_areas?: string[];
  [key: string]: any;
}

export interface AIMentorInteraction {
  id: string;
  conversation_id: string;
  student_id: string;
  query_type: string;
  student_message: string;
  ai_response: string;
  helpful?: boolean;
  response_time_ms: number;
  tokens_used: number;
  created_at: string;
}

// =====================================================
// PARENT DASHBOARD TYPES
// =====================================================

export interface ParentNotification {
  id: string;
  parent_id: string;
  student_id: string;
  notification_type: 'milestone' | 'stuck' | 'achievement' | 'weekly_report';
  title: string;
  message?: string;
  data?: Record<string, any>;
  read: boolean;
  emailed: boolean;
  created_at: string;
}

export interface ScreenTimeSetting {
  id: string;
  student_id: string;
  daily_limit_minutes?: number;
  weekly_limit_minutes?: number;
  allowed_days?: number[];
  allowed_time_start?: string;
  allowed_time_end?: string;
  break_reminder_enabled: boolean;
  break_interval_minutes: number;
  updated_at: string;
}

// =====================================================
// COMMUNITY TYPES
// =====================================================

export interface ForumPost {
  id: string;
  student_id: string;
  title: string;
  content: string;
  category: 'help' | 'showcase' | 'discussion';
  tags?: string[];
  code_snippet?: string;
  image_urls?: string[];
  views: number;
  upvotes: number;
  is_solved: boolean;
  is_flagged: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  post_id: string;
  student_id: string;
  content: string;
  code_snippet?: string;
  is_accepted_answer: boolean;
  upvotes: number;
  is_flagged: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumVote {
  id: string;
  student_id: string;
  post_id?: string;
  reply_id?: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

// =====================================================
// EVENTS & COMPETITIONS
// =====================================================

export interface Competition {
  id: string;
  title: string;
  description?: string;
  theme?: string;
  age_group?: AgeGroup;
  start_date: string;
  end_date: string;
  judging_end_date?: string;
  rules?: Record<string, any>;
  prizes?: Record<string, any>;
  max_participants?: number;
  is_team_based: boolean;
  active: boolean;
  created_at: string;
}

export interface CompetitionSubmission {
  id: string;
  competition_id: string;
  student_id: string;
  project_id?: string;
  submission_title: string;
  submission_description?: string;
  demo_url?: string;
  video_url?: string;
  score?: number;
  rank?: number;
  submitted_at: string;
}

// =====================================================
// BILLING TYPES
// =====================================================

export interface PaymentHistory {
  id: string;
  parent_id: string;
  amount: number;
  currency: string;
  subscription_tier?: SubscriptionTier;
  stripe_payment_id?: string;
  status: 'success' | 'failed' | 'refunded';
  created_at: string;
}

// =====================================================
// ACTIVITY LOGS
// =====================================================

export interface ActivityLog {
  id: string;
  user_id?: string;
  user_type?: UserRole;
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface StudentDashboardData {
  student: Student;
  current_track?: TrackEnrollment & { track: LearningTrack };
  recent_lessons: (LessonProgress & { lesson: Lesson })[];
  recent_badges: (StudentBadge & { badge: Badge })[];
  leaderboard_position?: LeaderboardEntry;
  weekly_activity: DailyActivity[];
  next_milestone: {
    type: string;
    progress: number;
    target: number;
    reward: string;
  };
}

export interface ParentDashboardData {
  parent: Parent;
  children: Student[];
  notifications: ParentNotification[];
  weekly_summary: {
    total_hours: number;
    lessons_completed: number;
    badges_earned: number;
    top_performing_child?: Student;
  };
}

export interface LessonWithProgress extends Lesson {
  progress?: LessonProgress;
}
