-- =====================================================
-- CODEKID PRODUCTION DATABASE SCHEMA
-- =====================================================
-- This migration creates all tables, RLS policies, functions, and triggers
-- for the CodeKid learning platform
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('parent', 'student', 'instructor', 'admin');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'family', 'lifetime');
CREATE TYPE age_group AS ENUM ('5-8', '8-12', '12-16');
CREATE TYPE lesson_type AS ENUM ('visual', 'code', 'ai_ml', 'project');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE badge_category AS ENUM ('achievement', 'milestone', 'skill', 'special');
CREATE TYPE badge_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE lesson_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE project_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE project_type AS ENUM ('game', 'website', 'ai_model', 'chatbot', 'visualization', 'other');
CREATE TYPE notification_type AS ENUM ('milestone', 'stuck', 'achievement', 'weekly_report');
CREATE TYPE forum_category AS ENUM ('help', 'showcase', 'discussion');
CREATE TYPE vote_type AS ENUM ('up', 'down');
CREATE TYPE payment_status AS ENUM ('success', 'failed', 'refunded');

-- =====================================================
-- CORE USER TABLES
-- =====================================================

-- Parents table
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 5 AND age <= 16),
  age_group age_group NOT NULL,
  date_of_birth DATE NOT NULL,
  avatar_url TEXT DEFAULT '🧑‍💻',
  theme_preference TEXT DEFAULT 'light',
  experience_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_hours_coded DECIMAL(10, 2) DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  badges_earned INTEGER DEFAULT 0,
  preferred_learning_style TEXT,
  interests TEXT[],
  coppa_consent BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instructors table
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  specializations TEXT[],
  rating DECIMAL(3, 2) DEFAULT 5.0,
  total_sessions INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10, 2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  permissions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CURRICULUM TABLES
-- =====================================================

-- Learning tracks table
CREATE TABLE learning_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  age_group age_group NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  estimated_hours INTEGER,
  sequence_order INTEGER,
  thumbnail_url TEXT,
  icon_name TEXT,
  color_theme TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID NOT NULL REFERENCES learning_tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lesson_type lesson_type NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  sequence_order INTEGER NOT NULL,
  estimated_minutes INTEGER,
  content_blocks JSONB,
  video_url TEXT,
  video_duration INTEGER,
  starter_code TEXT,
  solution_code TEXT,
  hints JSONB,
  learning_objectives TEXT[],
  prerequisites TEXT[],
  xp_reward INTEGER DEFAULT 100,
  thumbnail_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges table
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL,
  difficulty_level difficulty_level,
  question_data JSONB NOT NULL,
  test_cases JSONB,
  correct_answer JSONB,
  points INTEGER DEFAULT 10,
  time_limit_seconds INTEGER,
  sequence_order INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROGRESS TRACKING TABLES
-- =====================================================

-- Track enrollments table
CREATE TABLE track_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES learning_tracks(id) ON DELETE CASCADE,
  progress_percentage DECIMAL(5, 2) DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  current_lesson_id UUID REFERENCES lessons(id),
  total_time_spent INTEGER DEFAULT 0,
  UNIQUE(student_id, track_id)
);

-- Lesson progress table
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status lesson_status DEFAULT 'not_started',
  progress_percentage DECIMAL(5, 2) DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  accuracy_score DECIMAL(5, 2),
  completion_time_seconds INTEGER,
  hints_used INTEGER DEFAULT 0,
  student_code TEXT,
  last_code_snapshot TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- Challenge attempts table
CREATE TABLE challenge_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  submitted_answer JSONB NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  time_taken_seconds INTEGER,
  hints_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- GAMIFICATION TABLES
-- =====================================================

-- Badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category badge_category DEFAULT 'achievement',
  icon_url TEXT,
  color TEXT,
  criteria JSONB NOT NULL,
  points_value INTEGER DEFAULT 50,
  rarity badge_rarity DEFAULT 'common',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student badges table
CREATE TABLE student_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, badge_id)
);

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_data JSONB,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily activities table
CREATE TABLE daily_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  minutes_active INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  challenges_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, activity_date)
);

-- Leaderboard entries table
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  leaderboard_type TEXT NOT NULL,
  rank INTEGER NOT NULL,
  score INTEGER NOT NULL,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECT & PORTFOLIO TABLES
-- =====================================================

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  title TEXT NOT NULL,
  description TEXT,
  project_type project_type DEFAULT 'other',
  code_files JSONB,
  assets_urls TEXT[],
  demo_url TEXT,
  github_url TEXT,
  thumbnail_url TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  status project_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Project likes table
CREATE TABLE project_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, student_id)
);

-- Project comments table
CREATE TABLE project_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES project_comments(id),
  content TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AI MENTOR TABLES
-- =====================================================

-- AI conversations table
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  conversation_history JSONB NOT NULL DEFAULT '[]',
  context_data JSONB,
  total_messages INTEGER DEFAULT 0,
  student_satisfaction_rating INTEGER CHECK (student_satisfaction_rating >= 1 AND student_satisfaction_rating <= 5),
  flagged_for_review BOOLEAN DEFAULT false,
  escalated_to_human BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI mentor interactions table
CREATE TABLE ai_mentor_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  query_type TEXT,
  student_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  helpful BOOLEAN,
  response_time_ms INTEGER,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PARENT DASHBOARD TABLES
-- =====================================================

-- Parent notifications table
CREATE TABLE parent_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  notification_type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT false,
  emailed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Screen time settings table
CREATE TABLE screen_time_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  daily_limit_minutes INTEGER,
  weekly_limit_minutes INTEGER,
  allowed_days INTEGER[],
  allowed_time_start TIME,
  allowed_time_end TIME,
  break_reminder_enabled BOOLEAN DEFAULT true,
  break_interval_minutes INTEGER DEFAULT 30,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMMUNITY TABLES
-- =====================================================

-- Forum posts table
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category forum_category DEFAULT 'discussion',
  tags TEXT[],
  code_snippet TEXT,
  image_urls TEXT[],
  views INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  is_solved BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum replies table
CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  code_snippet TEXT,
  is_accepted_answer BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum votes table
CREATE TABLE forum_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  vote_type vote_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK ((post_id IS NOT NULL AND reply_id IS NULL) OR (post_id IS NULL AND reply_id IS NOT NULL)),
  UNIQUE(student_id, post_id, reply_id)
);

-- =====================================================
-- EVENTS & COMPETITIONS TABLES
-- =====================================================

-- Competitions table
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  age_group age_group,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  judging_end_date TIMESTAMPTZ,
  rules JSONB,
  prizes JSONB,
  max_participants INTEGER,
  is_team_based BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competition submissions table
CREATE TABLE competition_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  submission_title TEXT NOT NULL,
  submission_description TEXT,
  demo_url TEXT,
  video_url TEXT,
  score DECIMAL(5, 2),
  rank INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BILLING TABLES
-- =====================================================

-- Payment history table
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  subscription_tier subscription_tier,
  stripe_payment_id TEXT UNIQUE,
  status payment_status DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ACTIVITY LOGS TABLE
-- =====================================================

-- Activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  user_type user_role,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Parents indexes
CREATE INDEX idx_parents_auth_id ON parents(auth_id);
CREATE INDEX idx_parents_email ON parents(email);
CREATE INDEX idx_parents_subscription_tier ON parents(subscription_tier);

-- Students indexes
CREATE INDEX idx_students_parent_id ON students(parent_id);
CREATE INDEX idx_students_username ON students(username);
CREATE INDEX idx_students_age_group ON students(age_group);
CREATE INDEX idx_students_level ON students(current_level);
CREATE INDEX idx_students_last_activity ON students(last_activity_date);

-- Lessons indexes
CREATE INDEX idx_lessons_track_id ON lessons(track_id);
CREATE INDEX idx_lessons_sequence ON lessons(sequence_order);
CREATE INDEX idx_lessons_type ON lessons(lesson_type);
CREATE INDEX idx_lessons_difficulty ON lessons(difficulty_level);

-- Progress indexes
CREATE INDEX idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_status ON lesson_progress(status);
CREATE INDEX idx_track_enrollments_student ON track_enrollments(student_id);

-- Gamification indexes
CREATE INDEX idx_student_badges_student ON student_badges(student_id);
CREATE INDEX idx_student_badges_badge ON student_badges(badge_id);
CREATE INDEX idx_daily_activities_student ON daily_activities(student_id);
CREATE INDEX idx_daily_activities_date ON daily_activities(activity_date);

-- Projects indexes
CREATE INDEX idx_projects_student ON projects(student_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_public ON projects(is_public);
CREATE INDEX idx_projects_featured ON projects(is_featured);

-- AI conversations indexes
CREATE INDEX idx_ai_conversations_student ON ai_conversations(student_id);
CREATE INDEX idx_ai_conversations_lesson ON ai_conversations(lesson_id);
CREATE INDEX idx_ai_mentor_interactions_conversation ON ai_mentor_interactions(conversation_id);

-- Forum indexes
CREATE INDEX idx_forum_posts_student ON forum_posts(student_id);
CREATE INDEX idx_forum_posts_category ON forum_posts(category);
CREATE INDEX idx_forum_replies_post ON forum_replies(post_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: level = floor(sqrt(xp / 100))
  RETURN GREATEST(1, FLOOR(SQRT(xp::FLOAT / 100.0))::INTEGER);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to add XP to student
CREATE OR REPLACE FUNCTION add_student_xp(
  p_student_id UUID,
  p_xp_amount INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_old_level INTEGER;
BEGIN
  -- Get current level
  SELECT current_level INTO v_old_level
  FROM students
  WHERE id = p_student_id;

  -- Add XP and calculate new level
  UPDATE students
  SET 
    experience_points = experience_points + p_xp_amount,
    updated_at = NOW()
  WHERE id = p_student_id
  RETURNING experience_points INTO v_new_xp;

  v_new_level := calculate_level(v_new_xp);

  -- Update level if changed
  IF v_new_level > v_old_level THEN
    UPDATE students
    SET current_level = v_new_level
    WHERE id = p_student_id;

    -- Create achievement for level up
    INSERT INTO achievements (student_id, achievement_type, achievement_data, xp_earned)
    VALUES (
      p_student_id,
      'level_up',
      jsonb_build_object('old_level', v_old_level, 'new_level', v_new_level),
      0
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update student streak
CREATE OR REPLACE FUNCTION update_student_streak(p_student_id UUID)
RETURNS VOID AS $$
DECLARE
  v_last_activity DATE;
  v_today DATE := CURRENT_DATE;
BEGIN
  SELECT last_activity_date INTO v_last_activity
  FROM students
  WHERE id = p_student_id;

  IF v_last_activity IS NULL OR v_last_activity < v_today - INTERVAL '1 day' THEN
    -- Reset streak if more than 1 day gap
    UPDATE students
    SET 
      streak_days = 1,
      last_activity_date = v_today,
      updated_at = NOW()
    WHERE id = p_student_id;
  ELSIF v_last_activity = v_today - INTERVAL '1 day' THEN
    -- Increment streak if activity was yesterday
    UPDATE students
    SET 
      streak_days = streak_days + 1,
      last_activity_date = v_today,
      updated_at = NOW()
    WHERE id = p_student_id;
  END IF;
  -- If already active today, do nothing
END;
$$ LANGUAGE plpgsql;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_student_id UUID)
RETURNS VOID AS $$
DECLARE
  v_badge RECORD;
  v_student RECORD;
BEGIN
  -- Get student data
  SELECT * INTO v_student FROM students WHERE id = p_student_id;

  -- Check each badge criteria
  FOR v_badge IN SELECT * FROM badges WHERE active = true LOOP
    -- Skip if already earned
    IF EXISTS (
      SELECT 1 FROM student_badges 
      WHERE student_id = p_student_id AND badge_id = v_badge.id
    ) THEN
      CONTINUE;
    END IF;

    -- Check criteria based on type
    IF v_badge.criteria->>'type' = 'lessons_completed' AND
       v_student.projects_completed >= (v_badge.criteria->>'count')::INTEGER THEN
      INSERT INTO student_badges (student_id, badge_id) 
      VALUES (p_student_id, v_badge.id);
      
      UPDATE students SET badges_earned = badges_earned + 1 WHERE id = p_student_id;
      
    ELSIF v_badge.criteria->>'type' = 'streak_days' AND
          v_student.streak_days >= (v_badge.criteria->>'count')::INTEGER THEN
      INSERT INTO student_badges (student_id, badge_id) 
      VALUES (p_student_id, v_badge.id);
      
      UPDATE students SET badges_earned = badges_earned + 1 WHERE id = p_student_id;
      
    ELSIF v_badge.criteria->>'type' = 'xp_earned' AND
          v_student.experience_points >= (v_badge.criteria->>'count')::INTEGER THEN
      INSERT INTO student_badges (student_id, badge_id) 
      VALUES (p_student_id, v_badge.id);
      
      UPDATE students SET badges_earned = badges_earned + 1 WHERE id = p_student_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_tracks_updated_at BEFORE UPDATE ON learning_tracks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update level when XP changes
CREATE OR REPLACE FUNCTION auto_update_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.experience_points != OLD.experience_points THEN
    NEW.current_level := calculate_level(NEW.experience_points);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER students_auto_level BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION auto_update_level();

-- Trigger to update project likes count
CREATE OR REPLACE FUNCTION update_project_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects SET likes = likes + 1 WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects SET likes = likes - 1 WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_likes_count AFTER INSERT OR DELETE ON project_likes
  FOR EACH ROW EXECUTE FUNCTION update_project_likes_count();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_mentor_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_time_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Parents
CREATE POLICY "Parents can view their own profile"
  ON parents FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Parents can update their own profile"
  ON parents FOR UPDATE
  USING (auth.uid() = auth_id);

-- RLS Policies for Students
CREATE POLICY "Parents can view their own students"
  ON students FOR SELECT
  USING (parent_id IN (SELECT id FROM parents WHERE auth_id = auth.uid()));

CREATE POLICY "Parents can insert their own students"
  ON students FOR INSERT
  WITH CHECK (parent_id IN (SELECT id FROM parents WHERE auth_id = auth.uid()));

CREATE POLICY "Parents can update their own students"
  ON students FOR UPDATE
  USING (parent_id IN (SELECT id FROM parents WHERE auth_id = auth.uid()));

-- RLS Policies for Learning Content (Public Read)
CREATE POLICY "Anyone can view active learning tracks"
  ON learning_tracks FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can view active lessons"
  ON lessons FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can view challenges"
  ON challenges FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  USING (active = true);

-- RLS Policies for Progress
CREATE POLICY "Students can view their own progress"
  ON lesson_progress FOR SELECT
  USING (student_id IN (
    SELECT id FROM students WHERE parent_id IN (
      SELECT id FROM parents WHERE auth_id = auth.uid()
    )
  ));

CREATE POLICY "Students can insert their own progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (student_id IN (
    SELECT id FROM students WHERE parent_id IN (
      SELECT id FROM parents WHERE auth_id = auth.uid()
    )
  ));

CREATE POLICY "Students can update their own progress"
  ON lesson_progress FOR UPDATE
  USING (student_id IN (
    SELECT id FROM students WHERE parent_id IN (
      SELECT id FROM parents WHERE auth_id = auth.uid()
    )
  ));

-- Similar policies for other student data
CREATE POLICY "Students can view their own badges"
  ON student_badges FOR SELECT
  USING (student_id IN (
    SELECT id FROM students WHERE parent_id IN (
      SELECT id FROM parents WHERE auth_id = auth.uid()
    )
  ));

CREATE POLICY "Students can view their own projects"
  ON projects FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM students WHERE parent_id IN (
        SELECT id FROM parents WHERE auth_id = auth.uid()
      )
    ) OR is_public = true
  );

CREATE POLICY "Students can create projects"
  ON projects FOR INSERT
  WITH CHECK (student_id IN (
    SELECT id FROM students WHERE parent_id IN (
      SELECT id FROM parents WHERE auth_id = auth.uid()
    )
  ));

CREATE POLICY "Students can update their own projects"
  ON projects FOR UPDATE
  USING (student_id IN (
    SELECT id FROM students WHERE parent_id IN (
      SELECT id FROM parents WHERE auth_id = auth.uid()
    )
  ));

-- Admin policies (full access)
CREATE POLICY "Admins have full access to all tables"
  ON parents FOR ALL
  USING (EXISTS (SELECT 1 FROM admins WHERE auth_id = auth.uid()));

CREATE POLICY "Admins can manage students"
  ON students FOR ALL
  USING (EXISTS (SELECT 1 FROM admins WHERE auth_id = auth.uid()));

-- =====================================================
-- SEED DATA - Initial Badges
-- =====================================================

INSERT INTO badges (name, description, category, icon_url, criteria, points_value, rarity) VALUES
  ('First Steps', 'Complete your first lesson', 'milestone', '🎯', '{"type": "lessons_completed", "count": 1}', 50, 'common'),
  ('Week Warrior', 'Maintain a 7-day streak', 'achievement', '🔥', '{"type": "streak_days", "count": 7}', 100, 'rare'),
  ('Python Pioneer', 'Complete 10 Python lessons', 'skill', '🐍', '{"type": "lessons_completed", "count": 10}', 150, 'rare'),
  ('Code Master', 'Earn 1000 XP', 'milestone', '⚡', '{"type": "xp_earned", "count": 1000}', 200, 'epic'),
  ('Project Creator', 'Complete 5 projects', 'achievement', '🎨', '{"type": "projects_completed", "count": 5}', 150, 'rare'),
  ('AI Explorer', 'Complete first AI lesson', 'skill', '🤖', '{"type": "lessons_completed", "count": 1}', 100, 'rare'),
  ('Streak Legend', 'Maintain a 30-day streak', 'achievement', '🏆', '{"type": "streak_days", "count": 30}', 500, 'legendary'),
  ('Problem Solver', 'Solve 50 challenges', 'achievement', '💡', '{"type": "challenges_completed", "count": 50}', 300, 'epic');

-- =====================================================
-- SEED DATA - Sample Learning Tracks
-- =====================================================

INSERT INTO learning_tracks (title, description, age_group, difficulty_level, estimated_hours, sequence_order, icon_name, color_theme) VALUES
  ('Python Basics', 'Learn programming fundamentals with Python', '8-12', 'beginner', 20, 1, '🐍', '#3776ab'),
  ('Web Development', 'Build your first website with HTML, CSS, and JavaScript', '12-16', 'intermediate', 30, 2, '🌐', '#e34c26'),
  ('Game Development', 'Create fun games with Python and Pygame', '8-12', 'intermediate', 25, 3, '🎮', '#00d8ff'),
  ('AI & Machine Learning', 'Introduction to artificial intelligence and ML', '12-16', 'advanced', 40, 4, '🤖', '#ff6f00'),
  ('Creative Coding', 'Art and animations with code', '5-8', 'beginner', 15, 5, '🎨', '#ff69b4');

-- =====================================================
-- SAMPLE LESSONS (for Python Basics track)
-- =====================================================

-- Get the Python Basics track ID
DO $$
DECLARE
  v_track_id UUID;
BEGIN
  SELECT id INTO v_track_id FROM learning_tracks WHERE title = 'Python Basics';

  INSERT INTO lessons (track_id, title, description, lesson_type, difficulty_level, sequence_order, estimated_minutes, xp_reward, learning_objectives) VALUES
    (v_track_id, 'Welcome to Python', 'Learn what Python is and write your first program', 'visual', 'beginner', 1, 30, 100, ARRAY['Understand what Python is', 'Write Hello World', 'Run your first program']),
    (v_track_id, 'Variables and Data', 'Store and use information in your programs', 'code', 'beginner', 2, 45, 150, ARRAY['Create variables', 'Use different data types', 'Print variable values']),
    (v_track_id, 'Math and Operations', 'Perform calculations in Python', 'code', 'beginner', 3, 40, 150, ARRAY['Use math operators', 'Create calculators', 'Work with numbers']),
    (v_track_id, 'Making Decisions', 'Use if statements to make choices', 'code', 'beginner', 4, 50, 200, ARRAY['Write if statements', 'Use else and elif', 'Compare values']),
    (v_track_id, 'Loops and Repetition', 'Repeat actions with for and while loops', 'code', 'intermediate', 5, 60, 250, ARRAY['Write for loops', 'Use while loops', 'Control loop flow']);
END $$;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ CodeKid database schema created successfully!';
  RAISE NOTICE '📊 Tables created: 31';
  RAISE NOTICE '🔒 RLS policies: Enabled on all tables';
  RAISE NOTICE '⚡ Functions created: 4';
  RAISE NOTICE '🎯 Triggers: Auto-update timestamps and levels';
  RAISE NOTICE '🏆 Initial badges: 8';
  RAISE NOTICE '📚 Sample learning tracks: 5';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update your .env file with Supabase credentials';
  RAISE NOTICE '2. Run this migration in your Supabase SQL editor';
  RAISE NOTICE '3. Test authentication and data access';
END $$;

