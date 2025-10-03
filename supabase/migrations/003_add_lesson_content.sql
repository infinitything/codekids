-- =====================================================
-- CODEKID LESSON CONTENT SEED
-- Adds comprehensive lesson content for all 5 learning tracks
-- =====================================================

-- ==================== LESSONS FOR EACH TRACK ====================

-- Track 1: Visual Programming Adventures (5-8, beginner)
-- ID: 637dfc62-8987-46bc-808e-c08b2fd46d63
INSERT INTO public.lessons (track_id, title, description, lesson_type, difficulty_level, sequence_order) VALUES
('637dfc62-8987-46bc-808e-c08b2fd46d63', 'Welcome to Coding!', 'Learn what coding is and create your first moving character', 'visual', 'beginner', 1),
('637dfc62-8987-46bc-808e-c08b2fd46d63', 'Making Things Move', 'Control character movement with simple blocks', 'visual', 'beginner', 2),
('637dfc62-8987-46bc-808e-c08b2fd46d63', 'Colors and Sounds', 'Add colors and sounds to your creations', 'visual', 'beginner', 3),
('637dfc62-8987-46bc-808e-c08b2fd46d63', 'If-Then Magic', 'Learn how to make decisions in your code', 'visual', 'beginner', 4),
('637dfc62-8987-46bc-808e-c08b2fd46d63', 'Loops are Fun!', 'Repeat actions easily with loops', 'visual', 'beginner', 5),
('637dfc62-8987-46bc-808e-c08b2fd46d63', 'My First Game', 'Build a simple game using everything you learned', 'visual', 'beginner', 6);

-- Track 2: Python Explorer (8-12, beginner)
-- ID: 3d845dd7-74f3-4a6e-9414-da5b74a0bf9a
INSERT INTO public.lessons (track_id, title, description, lesson_type, difficulty_level, sequence_order) VALUES
('3d845dd7-74f3-4a6e-9414-da5b74a0bf9a', 'Hello Python!', 'Write your first Python program and print messages', 'code', 'beginner', 1),
('3d845dd7-74f3-4a6e-9414-da5b74a0bf9a', 'Variables and Data', 'Store information in variables and use different data types', 'code', 'beginner', 2),
('3d845dd7-74f3-4a6e-9414-da5b74a0bf9a', 'Python Math', 'Use Python for calculations and math operations', 'code', 'beginner', 3),
('3d845dd7-74f3-4a6e-9414-da5b74a0bf9a', 'Making Decisions', 'Use if-else statements to control your program flow', 'code', 'beginner', 4),
('3d845dd7-74f3-4a6e-9414-da5b74a0bf9a', 'Lists and Loops', 'Work with lists and iterate through data', 'code', 'beginner', 5),
('3d845dd7-74f3-4a6e-9414-da5b74a0bf9a', 'Functions Basics', 'Create reusable code with functions', 'code', 'beginner', 6),
('3d845dd7-74f3-4a6e-9414-da5b74a0bf9a', 'Final Project: Calculator', 'Build your own calculator app', 'project', 'beginner', 7);

-- Track 3: Web Development Basics (8-12, intermediate)
-- ID: 21b512dd-ff79-45a0-bab3-927aa8f58d1a
INSERT INTO public.lessons (track_id, title, description, lesson_type, difficulty_level, sequence_order) VALUES
('21b512dd-ff79-45a0-bab3-927aa8f58d1a', 'HTML Basics', 'Learn the structure of web pages with HTML', 'code', 'intermediate', 1),
('21b512dd-ff79-45a0-bab3-927aa8f58d1a', 'CSS Styling', 'Make your websites beautiful with CSS', 'code', 'intermediate', 2),
('21b512dd-ff79-45a0-bab3-927aa8f58d1a', 'JavaScript Intro', 'Add interactivity to your web pages', 'code', 'intermediate', 3),
('21b512dd-ff79-45a0-bab3-927aa8f58d1a', 'Responsive Design', 'Make websites work on any device', 'code', 'intermediate', 4),
('21b512dd-ff79-45a0-bab3-927aa8f58d1a', 'Interactive Forms', 'Create forms that users can fill out', 'code', 'intermediate', 5),
('21b512dd-ff79-45a0-bab3-927aa8f58d1a', 'Final Project: Personal Website', 'Build your own personal website from scratch', 'project', 'intermediate', 6);

-- Track 4: AI & Machine Learning Intro (12-16, intermediate)
-- ID: 639590c7-10bf-419d-90b1-cb884364eafb
INSERT INTO public.lessons (track_id, title, description, lesson_type, difficulty_level, sequence_order) VALUES
('639590c7-10bf-419d-90b1-cb884364eafb', 'What is AI?', 'Understand artificial intelligence and machine learning basics', 'ai_ml', 'intermediate', 1),
('639590c7-10bf-419d-90b1-cb884364eafb', 'Python for AI', 'Learn Python libraries used in AI development', 'code', 'intermediate', 2),
('639590c7-10bf-419d-90b1-cb884364eafb', 'Data Analysis', 'Analyze and visualize data with Python', 'code', 'intermediate', 3),
('639590c7-10bf-419d-90b1-cb884364eafb', 'Training Models', 'Create your first machine learning model', 'ai_ml', 'intermediate', 4),
('639590c7-10bf-419d-90b1-cb884364eafb', 'Image Recognition', 'Build a program that recognizes images', 'ai_ml', 'intermediate', 5),
('639590c7-10bf-419d-90b1-cb884364eafb', 'Final Project: Chatbot', 'Create a simple AI-powered chatbot', 'project', 'intermediate', 6);

-- Track 5: Game Development (12-16, advanced)
-- ID: 90cfae06-01bb-4b71-9eac-cd95f968edb4
INSERT INTO public.lessons (track_id, title, description, lesson_type, difficulty_level, sequence_order) VALUES
('90cfae06-01bb-4b71-9eac-cd95f968edb4', 'Game Design Basics', 'Learn fundamental game design principles', 'code', 'advanced', 1),
('90cfae06-01bb-4b71-9eac-cd95f968edb4', 'Pygame Setup', 'Set up your game development environment', 'code', 'advanced', 2),
('90cfae06-01bb-4b71-9eac-cd95f968edb4', 'Sprites and Movement', 'Create game characters and make them move', 'code', 'advanced', 3),
('90cfae06-01bb-4b71-9eac-cd95f968edb4', 'Collision Detection', 'Detect when game objects interact', 'code', 'advanced', 4),
('90cfae06-01bb-4b71-9eac-cd95f968edb4', 'Game Physics', 'Add realistic physics to your games', 'code', 'advanced', 5),
('90cfae06-01bb-4b71-9eac-cd95f968edb4', 'Sound and Music', 'Add audio to enhance the gaming experience', 'code', 'advanced', 6),
('90cfae06-01bb-4b71-9eac-cd95f968edb4', 'Final Project: Platform Game', 'Build a complete platform game', 'project', 'advanced', 7);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully inserted 32 lessons across 5 learning tracks!';
END $$;
