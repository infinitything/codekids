/**
 * Database Seeding Script for CodeKid
 * Populates the database with sample learning tracks, lessons, badges, and demo users
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Get environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials. Check your .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Create Learning Tracks
    console.log('📚 Creating learning tracks...');
    const tracks = [
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        age_group: '8-10',
        difficulty_level: 'beginner',
        estimated_hours: 20,
        sequence_order: 1,
        thumbnail_url: '/images/tracks/js-fundamentals.png',
        icon_name: 'Code',
        color_theme: '#f7df1e',
        active: true,
      },
      {
        title: 'Python Adventures',
        description: 'Explore Python programming through fun projects',
        age_group: '8-10',
        difficulty_level: 'beginner',
        estimated_hours: 25,
        sequence_order: 2,
        thumbnail_url: '/images/tracks/python-adventures.png',
        icon_name: 'Rocket',
        color_theme: '#3776ab',
        active: true,
      },
      {
        title: 'Web Development',
        description: 'Build your first websites with HTML and CSS',
        age_group: '11-13',
        difficulty_level: 'beginner',
        estimated_hours: 30,
        sequence_order: 3,
        thumbnail_url: '/images/tracks/web-dev.png',
        icon_name: 'Globe',
        color_theme: '#e34f26',
        active: true,
      },
      {
        title: 'Game Development',
        description: 'Create your own games from scratch',
        age_group: '11-13',
        difficulty_level: 'intermediate',
        estimated_hours: 40,
        sequence_order: 4,
        thumbnail_url: '/images/tracks/game-dev.png',
        icon_name: 'Gamepad2',
        color_theme: '#9147ff',
        active: true,
      },
    ];

    const { data: trackData, error: trackError } = await supabase
      .from('learning_tracks')
      .insert(tracks)
      .select();

    if (trackError) throw trackError;
    console.log(`✅ Created ${trackData.length} learning tracks\n`);

    // 2. Create Lessons for each track
    console.log('📖 Creating lessons...');
    const lessons = [];

    // JavaScript Fundamentals Lessons
    const jsTrack = trackData.find((t) => t.title === 'JavaScript Fundamentals');
    if (jsTrack) {
      lessons.push(
        {
          track_id: jsTrack.id,
          title: 'Hello, JavaScript!',
          description: 'Your first steps into programming with JavaScript',
          lesson_type: 'tutorial',
          difficulty_level: 'beginner',
          sequence_order: 1,
          estimated_minutes: 30,
          content_blocks: [
            {
              type: 'text',
              content: 'Welcome to JavaScript! Let\'s learn how to display messages.',
            },
            {
              type: 'code-demo',
              content: 'console.log("Hello, CodeKid!");',
              language: 'javascript',
            },
            {
              type: 'interactive',
              content: 'Now it\'s your turn! Try changing the message.',
            },
          ],
          starter_code: '// Write your first JavaScript code here!\nconsole.log("Hello, World!");',
          solution_code: 'console.log("Hello, CodeKid!");',
          hints: [
            { order: 1, content: 'Use console.log() to display messages' },
            { order: 2, content: 'Put your text inside quotes' },
          ],
          learning_objectives: [
            'Understand what JavaScript is',
            'Learn how to use console.log()',
            'Write your first line of code',
          ],
          xp_reward: 50,
          active: true,
        },
        {
          track_id: jsTrack.id,
          title: 'Variables and Data Types',
          description: 'Learn how to store and use information in your programs',
          lesson_type: 'tutorial',
          difficulty_level: 'beginner',
          sequence_order: 2,
          estimated_minutes: 45,
          content_blocks: [
            {
              type: 'text',
              content: 'Variables are like containers that store information. Let\'s create some!',
            },
            {
              type: 'code-demo',
              content: 'let age = 10;\nlet name = "Alex";\nlet isCool = true;',
              language: 'javascript',
            },
          ],
          starter_code: '// Create a variable to store your favorite number\nlet favoriteNumber = ;\n\nconsole.log(favoriteNumber);',
          solution_code: 'let favoriteNumber = 42;\nconsole.log(favoriteNumber);',
          hints: [
            { order: 1, content: 'Use let to create a variable' },
            { order: 2, content: 'Numbers don\'t need quotes' },
          ],
          learning_objectives: [
            'Understand what variables are',
            'Learn different data types',
            'Store and retrieve values',
          ],
          xp_reward: 75,
          active: true,
        },
        {
          track_id: jsTrack.id,
          title: 'Making Decisions with If Statements',
          description: 'Learn how to make your code smart with conditional logic',
          lesson_type: 'tutorial',
          difficulty_level: 'beginner',
          sequence_order: 3,
          estimated_minutes: 50,
          content_blocks: [
            {
              type: 'text',
              content: 'If statements help your code make decisions based on conditions.',
            },
            {
              type: 'code-demo',
              content: 'let age = 10;\n\nif (age >= 10) {\n  console.log("You can learn to code!");\n}',
              language: 'javascript',
            },
          ],
          starter_code: '// Check if a number is positive\nlet number = 5;\n\nif (number > 0) {\n  // Your code here\n}',
          solution_code: 'let number = 5;\n\nif (number > 0) {\n  console.log("The number is positive!");\n}',
          hints: [
            { order: 1, content: 'Use > to compare numbers' },
            { order: 2, content: 'Put your action inside the curly braces' },
          ],
          learning_objectives: [
            'Understand conditional logic',
            'Use if statements',
            'Compare values',
          ],
          xp_reward: 100,
          active: true,
        }
      );
    }

    // Python Adventures Lessons
    const pythonTrack = trackData.find((t) => t.title === 'Python Adventures');
    if (pythonTrack) {
      lessons.push(
        {
          track_id: pythonTrack.id,
          title: 'Python Basics: Print and Variables',
          description: 'Start your Python journey with the basics',
          lesson_type: 'tutorial',
          difficulty_level: 'beginner',
          sequence_order: 1,
          estimated_minutes: 35,
          content_blocks: [
            {
              type: 'text',
              content: 'Python is a friendly language that\'s easy to read and write!',
            },
            {
              type: 'code-demo',
              content: 'print("Hello from Python!")\nname = "Alex"\nprint("My name is", name)',
              language: 'python',
            },
          ],
          starter_code: '# Print a welcome message\nprint("Welcome to Python!")\n\n# Create a variable with your age\nage = \n\nprint("I am", age, "years old")',
          solution_code: 'print("Welcome to Python!")\n\nage = 10\n\nprint("I am", age, "years old")',
          hints: [
            { order: 1, content: 'Use print() to display messages in Python' },
            { order: 2, content: 'Python doesn\'t need semicolons!' },
          ],
          learning_objectives: [
            'Learn Python print() function',
            'Create variables in Python',
            'Display multiple values',
          ],
          xp_reward: 50,
          active: true,
        },
        {
          track_id: pythonTrack.id,
          title: 'Python Lists: Store Multiple Items',
          description: 'Learn how to organize and manage collections of data',
          lesson_type: 'tutorial',
          difficulty_level: 'beginner',
          sequence_order: 2,
          estimated_minutes: 40,
          content_blocks: [
            {
              type: 'text',
              content: 'Lists let you store multiple items in a single variable!',
            },
            {
              type: 'code-demo',
              content: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])  # Prints: apple',
              language: 'python',
            },
          ],
          starter_code: '# Create a list of your favorite colors\ncolors = []\n\nprint("My first favorite color is:", colors[0])',
          solution_code: 'colors = ["blue", "green", "purple"]\n\nprint("My first favorite color is:", colors[0])',
          hints: [
            { order: 1, content: 'Use square brackets [] to create a list' },
            { order: 2, content: 'List items are separated by commas' },
          ],
          learning_objectives: [
            'Create Python lists',
            'Access list items by index',
            'Understand zero-based indexing',
          ],
          xp_reward: 75,
          active: true,
        }
      );
    }

    // Web Development Lessons
    const webTrack = trackData.find((t) => t.title === 'Web Development');
    if (webTrack) {
      lessons.push(
        {
          track_id: webTrack.id,
          title: 'HTML Basics: Your First Webpage',
          description: 'Create the structure of a webpage with HTML',
          lesson_type: 'tutorial',
          difficulty_level: 'beginner',
          sequence_order: 1,
          estimated_minutes: 40,
          content_blocks: [
            {
              type: 'text',
              content: 'HTML is the building block of every website. Let\'s create your first page!',
            },
            {
              type: 'code-demo',
              content: '<h1>My First Webpage</h1>\n<p>Welcome to my site!</p>',
              language: 'html',
            },
          ],
          starter_code: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <!-- Add your content here -->\n</body>\n</html>',
          solution_code: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Welcome to My Website</h1>\n  <p>This is my first webpage!</p>\n</body>\n</html>',
          hints: [
            { order: 1, content: 'Use <h1> for headings' },
            { order: 2, content: 'Use <p> for paragraphs' },
          ],
          learning_objectives: [
            'Understand HTML structure',
            'Create headings and paragraphs',
            'Build a basic webpage',
          ],
          xp_reward: 100,
          active: true,
        }
      );
    }

    const { data: lessonData, error: lessonError } = await supabase
      .from('lessons')
      .insert(lessons)
      .select();

    if (lessonError) throw lessonError;
    console.log(`✅ Created ${lessonData.length} lessons\n`);

    // 3. Create Badges
    console.log('🏆 Creating badges...');
    const badges = [
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        category: 'learning',
        icon_url: '/images/badges/first-steps.png',
        color: '#3b82f6',
        criteria: { lessons_completed: 1 },
        points_value: 10,
        rarity: 'common',
        active: true,
      },
      {
        name: 'Quick Learner',
        description: 'Complete 5 lessons',
        category: 'learning',
        icon_url: '/images/badges/quick-learner.png',
        color: '#10b981',
        criteria: { lessons_completed: 5 },
        points_value: 25,
        rarity: 'uncommon',
        active: true,
      },
      {
        name: 'Code Master',
        description: 'Complete 20 lessons',
        category: 'learning',
        icon_url: '/images/badges/code-master.png',
        color: '#8b5cf6',
        criteria: { lessons_completed: 20 },
        points_value: 100,
        rarity: 'rare',
        active: true,
      },
      {
        name: 'Streak Starter',
        description: 'Maintain a 3-day learning streak',
        category: 'streak',
        icon_url: '/images/badges/streak-starter.png',
        color: '#f59e0b',
        criteria: { streak_days: 3 },
        points_value: 15,
        rarity: 'common',
        active: true,
      },
      {
        name: 'Dedication Champion',
        description: 'Maintain a 7-day learning streak',
        category: 'streak',
        icon_url: '/images/badges/dedication-champion.png',
        color: '#ef4444',
        criteria: { streak_days: 7 },
        points_value: 50,
        rarity: 'uncommon',
        active: true,
      },
      {
        name: 'XP Hunter',
        description: 'Earn 500 experience points',
        category: 'achievement',
        icon_url: '/images/badges/xp-hunter.png',
        color: '#06b6d4',
        criteria: { experience_points: 500 },
        points_value: 30,
        rarity: 'uncommon',
        active: true,
      },
      {
        name: 'Project Creator',
        description: 'Create your first project',
        category: 'project',
        icon_url: '/images/badges/project-creator.png',
        color: '#ec4899',
        criteria: { projects_created: 1 },
        points_value: 20,
        rarity: 'common',
        active: true,
      },
      {
        name: 'Challenge Accepted',
        description: 'Complete your first challenge',
        category: 'challenge',
        icon_url: '/images/badges/challenge-accepted.png',
        color: '#f97316',
        criteria: { challenges_completed: 1 },
        points_value: 15,
        rarity: 'common',
        active: true,
      },
    ];

    const { data: badgeData, error: badgeError } = await supabase
      .from('badges')
      .insert(badges)
      .select();

    if (badgeError) throw badgeError;
    console.log(`✅ Created ${badgeData.length} badges\n`);

    // 4. Create sample challenges
    console.log('🎯 Creating challenges...');
    const challenges = [];

    const jsLesson = lessonData.find((l) => l.title === 'Hello, JavaScript!');
    if (jsLesson) {
      challenges.push({
        lesson_id: jsLesson.id,
        title: 'Display Your Name',
        description: 'Use console.log() to display your name',
        challenge_type: 'coding',
        difficulty_level: 'beginner',
        question_data: {
          prompt: 'Write code that displays your name using console.log()',
        },
        test_cases: [
          {
            description: 'Should call console.log()',
            test: 'code includes console.log',
          },
        ],
        correct_answer: { pattern: 'console.log' },
        points: 25,
        time_limit_seconds: 300,
        sequence_order: 1,
        active: true,
      });
    }

    if (challenges.length > 0) {
      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .insert(challenges)
        .select();

      if (challengeError) throw challengeError;
      console.log(`✅ Created ${challengeData.length} challenges\n`);
    }

    console.log('✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - Learning Tracks: ${trackData.length}`);
    console.log(`  - Lessons: ${lessonData.length}`);
    console.log(`  - Badges: ${badgeData.length}`);
    console.log(`  - Challenges: ${challenges.length}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();

