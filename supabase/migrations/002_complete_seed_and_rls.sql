-- =====================================================
-- CODEKID COMPLETE SEED & RLS SETUP
-- This script adds: RLS Policies + Sample Data
-- =====================================================

-- ==================== RLS POLICIES ====================

-- Enable RLS on all tables
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Parents can view own profile" ON public.parents;
DROP POLICY IF EXISTS "Parents can update own profile" ON public.parents;
DROP POLICY IF EXISTS "Students can view own profile" ON public.students;
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;
DROP POLICY IF EXISTS "Anyone can view active tracks" ON public.learning_tracks;
DROP POLICY IF EXISTS "Anyone can view active lessons" ON public.lessons;
DROP POLICY IF EXISTS "Students can view own progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Students can insert own progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Students can update own progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Anyone can view badges" ON public.badges;
DROP POLICY IF EXISTS "Students can view own badges" ON public.student_badges;
DROP POLICY IF EXISTS "Students can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Students can insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Students can update own projects" ON public.projects;

-- Parents policies
CREATE POLICY "Parents can view own profile"
ON public.parents FOR SELECT
TO authenticated
USING (auth_id = auth.uid());

CREATE POLICY "Parents can update own profile"
ON public.parents FOR UPDATE
TO authenticated
USING (auth_id = auth.uid());

-- Students policies
CREATE POLICY "Students can view own profile"
ON public.students FOR SELECT
TO authenticated
USING (id = auth.uid() OR parent_id IN (
  SELECT id FROM public.parents WHERE auth_id = auth.uid()
));

CREATE POLICY "Parents can view their children"
ON public.students FOR SELECT
TO authenticated
USING (parent_id IN (
  SELECT id FROM public.parents WHERE auth_id = auth.uid()
));

-- Learning tracks - public read
CREATE POLICY "Anyone can view active tracks"
ON public.learning_tracks FOR SELECT
TO authenticated, anon
USING (active = true);

-- Lessons - public read
CREATE POLICY "Anyone can view active lessons"
ON public.lessons FOR SELECT
TO authenticated, anon
USING (active = true);

-- Lesson progress - student only
CREATE POLICY "Students can view own progress"
ON public.lesson_progress FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "Students can insert own progress"
ON public.lesson_progress FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own progress"
ON public.lesson_progress FOR UPDATE
TO authenticated
USING (student_id = auth.uid());

-- Badges - public read
CREATE POLICY "Anyone can view badges"
ON public.badges FOR SELECT
TO authenticated, anon
USING (active = true);

-- Student badges - student can view
CREATE POLICY "Students can view own badges"
ON public.student_badges FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Projects - students can manage own
CREATE POLICY "Students can view own projects"
ON public.projects FOR SELECT
TO authenticated
USING (student_id = auth.uid() OR is_public = true);

CREATE POLICY "Students can insert own projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own projects"
ON public.projects FOR UPDATE
TO authenticated
USING (student_id = auth.uid());

-- ==================== SAMPLE DATA ====================

-- Insert Learning Tracks
INSERT INTO public.learning_tracks (title, description, age_group, difficulty_level, estimated_hours, sequence_order, thumbnail_url, icon_name, color_theme, active) VALUES
('JavaScript Fundamentals', 'Learn the basics of JavaScript programming with fun, interactive lessons', '8-10', 'beginner', 20, 1, '/images/tracks/js-fundamentals.png', 'Code', '#f7df1e', true),
('Python Adventures', 'Explore Python programming through exciting projects and challenges', '8-10', 'beginner', 25, 2, '/images/tracks/python-adventures.png', 'Rocket', '#3776ab', true),
('Web Development', 'Build your first websites with HTML, CSS, and JavaScript', '11-13', 'beginner', 30, 3, '/images/tracks/web-dev.png', 'Globe', '#e34f26', true),
('Game Development', 'Create your own games from scratch using modern tools', '11-13', 'intermediate', 40, 4, '/images/tracks/game-dev.png', 'Gamepad2', '#9147ff', true)
ON CONFLICT DO NOTHING;

-- Get track IDs
DO $$
DECLARE
  js_track_id UUID;
  python_track_id UUID;
  web_track_id UUID;
BEGIN
  -- Get track IDs
  SELECT id INTO js_track_id FROM public.learning_tracks WHERE title = 'JavaScript Fundamentals';
  SELECT id INTO python_track_id FROM public.learning_tracks WHERE title = 'Python Adventures';
  SELECT id INTO web_track_id FROM public.learning_tracks WHERE title = 'Web Development';

  -- JavaScript Lessons
  INSERT INTO public.lessons (track_id, title, description, lesson_type, difficulty_level, sequence_order, estimated_minutes, content_blocks, starter_code, solution_code, hints, learning_objectives, xp_reward, active) VALUES
  (js_track_id, 'Hello, JavaScript!', 'Your first steps into programming with JavaScript', 'tutorial', 'beginner', 1, 30, 
    '[{"type":"text","content":"Welcome to JavaScript! Let''s learn how to display messages."},{"type":"code-demo","content":"console.log(\"Hello, CodeKid!\");","language":"javascript"}]'::jsonb,
    '// Write your first JavaScript code here!\nconsole.log("Hello, World!");',
    'console.log("Hello, CodeKid!");',
    '[{"order":1,"content":"Use console.log() to display messages"},{"order":2,"content":"Put your text inside quotes"}]'::jsonb,
    ARRAY['Understand what JavaScript is', 'Learn how to use console.log()', 'Write your first line of code'],
    50, true),
  
  (js_track_id, 'Variables and Data Types', 'Learn how to store and use information in your programs', 'tutorial', 'beginner', 2, 45,
    '[{"type":"text","content":"Variables are like containers that store information."},{"type":"code-demo","content":"let age = 10;\\nlet name = \"Alex\";\\nconsole.log(name, age);","language":"javascript"}]'::jsonb,
    '// Create variables to store your information\nlet favoriteNumber = ;\nlet favoriteColor = ;\n\nconsole.log("My favorite number is", favoriteNumber);\nconsole.log("My favorite color is", favoriteColor);',
    'let favoriteNumber = 42;\nlet favoriteColor = "blue";\n\nconsole.log("My favorite number is", favoriteNumber);\nconsole.log("My favorite color is", favoriteColor);',
    '[{"order":1,"content":"Use let to create a variable"},{"order":2,"content":"Numbers don''t need quotes, but text does"}]'::jsonb,
    ARRAY['Understand what variables are', 'Learn different data types', 'Store and retrieve values'],
    75, true),

  (js_track_id, 'Making Decisions with If Statements', 'Learn how to make your code smart with conditional logic', 'tutorial', 'beginner', 3, 50,
    '[{"type":"text","content":"If statements help your code make decisions."},{"type":"code-demo","content":"let age = 10;\\n\\nif (age >= 10) {\\n  console.log(\"You can learn to code!\");\\n}","language":"javascript"}]'::jsonb,
    '// Check if a number is positive\nlet number = 5;\n\nif (number > 0) {\n  // Your code here\n}',
    'let number = 5;\n\nif (number > 0) {\n  console.log("The number is positive!");\n}',
    '[{"order":1,"content":"Use > to compare numbers"},{"order":2,"content":"Put your action inside the curly braces"}]'::jsonb,
    ARRAY['Understand conditional logic', 'Use if statements', 'Compare values'],
    100, true)
  ON CONFLICT DO NOTHING;

  -- Python Lessons
  INSERT INTO public.lessons (track_id, title, description, lesson_type, difficulty_level, sequence_order, estimated_minutes, content_blocks, starter_code, solution_code, hints, learning_objectives, xp_reward, active) VALUES
  (python_track_id, 'Python Basics: Print and Variables', 'Start your Python journey with the basics', 'tutorial', 'beginner', 1, 35,
    '[{"type":"text","content":"Python is a friendly language that''s easy to read!"},{"type":"code-demo","content":"print(\"Hello from Python!\")\\nname = \"Alex\"\\nprint(\"My name is\", name)","language":"python"}]'::jsonb,
    '# Print a welcome message\nprint("Welcome to Python!")\n\n# Create a variable with your age\nage = \n\nprint("I am", age, "years old")',
    'print("Welcome to Python!")\n\nage = 10\n\nprint("I am", age, "years old")',
    '[{"order":1,"content":"Use print() to display messages"},{"order":2,"content":"Python doesn''t need semicolons!"}]'::jsonb,
    ARRAY['Learn Python print() function', 'Create variables in Python', 'Display multiple values'],
    50, true),

  (python_track_id, 'Python Lists: Store Multiple Items', 'Learn how to organize and manage collections of data', 'tutorial', 'beginner', 2, 40,
    '[{"type":"text","content":"Lists let you store multiple items in one variable!"},{"type":"code-demo","content":"fruits = [\"apple\", \"banana\", \"cherry\"]\\nprint(fruits[0])  # Prints: apple","language":"python"}]'::jsonb,
    '# Create a list of your favorite colors\ncolors = []\n\nprint("My first favorite color is:", colors[0])',
    'colors = ["blue", "green", "purple"]\n\nprint("My first favorite color is:", colors[0])',
    '[{"order":1,"content":"Use square brackets [] to create a list"},{"order":2,"content":"Separate items with commas"}]'::jsonb,
    ARRAY['Create Python lists', 'Access list items by index', 'Understand zero-based indexing'],
    75, true)
  ON CONFLICT DO NOTHING;

  -- Web Development Lessons
  INSERT INTO public.lessons (track_id, title, description, lesson_type, difficulty_level, sequence_order, estimated_minutes, content_blocks, starter_code, solution_code, hints, learning_objectives, xp_reward, active) VALUES
  (web_track_id, 'HTML Basics: Your First Webpage', 'Create the structure of a webpage with HTML', 'tutorial', 'beginner', 1, 40,
    '[{"type":"text","content":"HTML is the building block of every website!"},{"type":"code-demo","content":"<h1>My First Webpage</h1>\\n<p>Welcome to my site!</p>","language":"html"}]'::jsonb,
    '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <!-- Add your content here -->\n</body>\n</html>',
    '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Welcome to My Website</h1>\n  <p>This is my first webpage!</p>\n</body>\n</html>',
    '[{"order":1,"content":"Use <h1> for headings"},{"order":2,"content":"Use <p> for paragraphs"}]'::jsonb,
    ARRAY['Understand HTML structure', 'Create headings and paragraphs', 'Build a basic webpage'],
    100, true)
  ON CONFLICT DO NOTHING;

END $$;

-- Insert Badges
INSERT INTO public.badges (name, description, category, icon_url, color, criteria, points_value, rarity, active) VALUES
('First Steps', 'Complete your first lesson', 'learning', '/images/badges/first-steps.png', '#3b82f6', '{"lessons_completed":1}'::jsonb, 10, 'common', true),
('Quick Learner', 'Complete 5 lessons', 'learning', '/images/badges/quick-learner.png', '#10b981', '{"lessons_completed":5}'::jsonb, 25, 'uncommon', true),
('Code Master', 'Complete 20 lessons', 'learning', '/images/badges/code-master.png', '#8b5cf6', '{"lessons_completed":20}'::jsonb, 100, 'rare', true),
('Streak Starter', 'Maintain a 3-day learning streak', 'streak', '/images/badges/streak-starter.png', '#f59e0b', '{"streak_days":3}'::jsonb, 15, 'common', true),
('Dedication Champion', 'Maintain a 7-day learning streak', 'streak', '/images/badges/dedication-champion.png', '#ef4444', '{"streak_days":7}'::jsonb, 50, 'uncommon', true),
('XP Hunter', 'Earn 500 experience points', 'achievement', '/images/badges/xp-hunter.png', '#06b6d4', '{"experience_points":500}'::jsonb, 30, 'uncommon', true),
('Project Creator', 'Create your first project', 'project', '/images/badges/project-creator.png', '#ec4899', '{"projects_created":1}'::jsonb, 20, 'common', true),
('Challenge Accepted', 'Complete your first challenge', 'challenge', '/images/badges/challenge-accepted.png', '#f97316', '{"challenges_completed":1}'::jsonb, 15, 'common', true)
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database seeded successfully!';
  RAISE NOTICE '📚 Added 4 learning tracks';
  RAISE NOTICE '📖 Added 6 lessons (JS, Python, HTML)';
  RAISE NOTICE '🏆 Added 8 badges';
  RAISE NOTICE '🔒 Enabled RLS on all tables';
END $$;
