// Complete curriculum data structure

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  ageGroup: '5-8' | '8-12' | '12-16';
  category: 'python' | 'javascript' | 'web-dev' | 'game-dev' | 'ai-ml' | 'scratch';
  duration_minutes: number;
  xp_reward: number;
  
  // Lesson structure
  sections: LessonSection[];
  
  // Code editor type
  editorType: 'blockly' | 'monaco' | 'both';
  
  // Initial code/blocks
  starterCode?: string;
  starterBlocks?: any;
  
  // Solution (for validation)
  solutionCode?: string;
  
  // Challenges
  challenges: Challenge[];
}

export interface LessonSection {
  id: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'code-challenge';
  title: string;
  content: string;
  videoUrl?: string;
  duration_seconds?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  hints: string[];
  testCases: TestCase[];
  xp_reward: number;
}

export interface TestCase {
  input: any;
  expectedOutput: any;
  description: string;
}

// Sample Curriculum Data
export const pythonBeginnerCourse: LessonContent[] = [
  {
    id: 'py-001',
    title: 'Hello, Python!',
    description: 'Write your first Python program and learn about print statements',
    difficulty: 'beginner',
    ageGroup: '8-12',
    category: 'python',
    duration_minutes: 30,
    xp_reward: 100,
    editorType: 'monaco',
    
    sections: [
      {
        id: 'intro',
        type: 'video',
        title: 'Welcome to Python!',
        content: 'Meet Python, the friendly programming language that helps you tell computers what to do!',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video
        duration_seconds: 180
      },
      {
        id: 'learn',
        type: 'text',
        title: 'What is print()?',
        content: `
# The print() Function

In Python, we use \`print()\` to show messages on the screen. It's like making the computer talk!

## Examples:
\`\`\`python
print("Hello, World!")
print("My name is Alex")
print("I love coding!")
\`\`\`

Try changing the message inside the quotes to make the computer say whatever you want!
        `
      },
      {
        id: 'try-it',
        type: 'interactive',
        title: 'Try It Yourself!',
        content: 'Use the code editor below to write your own print statement. Make the computer say something fun!'
      }
    ],
    
    starterCode: `# Write your first Python program!
# Make the computer print your name

print("Hello, World!")`,
    
    solutionCode: `print("Hello, World!")
print("My name is Alex")`,
    
    challenges: [
      {
        id: 'challenge-1',
        title: 'Say Your Name',
        description: 'Make the computer print your name',
        instructions: [
          'Use the print() function',
          'Put your name inside quotes',
          'Press Run to see the result'
        ],
        hints: [
          'Remember to use quotes around your text',
          'Don\'t forget the parentheses ()',
          'Example: print("Alex")'
        ],
        testCases: [
          {
            input: null,
            expectedOutput: /print\s*\(\s*["'][a-zA-Z]+["']\s*\)/,
            description: 'Should print a name'
          }
        ],
        xp_reward: 50
      },
      {
        id: 'challenge-2',
        title: 'Multiple Messages',
        description: 'Print three different messages',
        instructions: [
          'Write three print statements',
          'Each one should say something different',
          'Run your code to see all three messages'
        ],
        hints: [
          'You can have multiple print() lines',
          'Each print() is on its own line',
          'Example:\nprint("First")\nprint("Second")'
        ],
        testCases: [
          {
            input: null,
            expectedOutput: /print.*\n.*print.*\n.*print/,
            description: 'Should have at least 3 print statements'
          }
        ],
        xp_reward: 75
      }
    ]
  },
  
  {
    id: 'py-002',
    title: 'Variables: Storing Information',
    description: 'Learn how to store and use data in variables',
    difficulty: 'beginner',
    ageGroup: '8-12',
    category: 'python',
    duration_minutes: 45,
    xp_reward: 150,
    editorType: 'monaco',
    
    sections: [
      {
        id: 'intro',
        type: 'text',
        title: 'What are Variables?',
        content: `
# Variables

Think of variables like boxes where you can store information! You can give each box a name and put different things inside.

## Examples:
\`\`\`python
name = "Alex"
age = 10
favorite_game = "Minecraft"

print(name)  # Shows: Alex
print(age)   # Shows: 10
\`\`\`

Variables can store:
- **Text** (called strings) - use quotes
- **Numbers** - no quotes needed
- **True/False** (called booleans)
        `
      },
      {
        id: 'practice',
        type: 'interactive',
        title: 'Create Your Variables',
        content: 'Create variables to store information about yourself!'
      }
    ],
    
    starterCode: `# Create variables about yourself!

name = "Your Name Here"
age = 10
favorite_color = "blue"

# Print your variables
print("Hi! My name is", name)
print("I am", age, "years old")
print("My favorite color is", favorite_color)`,
    
    challenges: [
      {
        id: 'var-challenge-1',
        title: 'Create Your Profile',
        description: 'Create variables for your name, age, and hobby',
        instructions: [
          'Create a variable called "name"',
          'Create a variable called "age"',
          'Create a variable called "hobby"',
          'Print all three'
        ],
        hints: [
          'Use = to store values in variables',
          'Text needs quotes, numbers don\'t',
          'Example: name = "Alex"'
        ],
        testCases: [
          {
            input: null,
            expectedOutput: /name\s*=.*age\s*=.*hobby\s*=/,
            description: 'Should create all three variables'
          }
        ],
        xp_reward: 100
      }
    ]
  },
  
  {
    id: 'py-003',
    title: 'Math with Python',
    description: 'Use Python as a super calculator!',
    difficulty: 'beginner',
    ageGroup: '8-12',
    category: 'python',
    duration_minutes: 40,
    xp_reward: 150,
    editorType: 'monaco',
    
    sections: [
      {
        id: 'intro',
        type: 'text',
        title: 'Python Math',
        content: `
# Python as a Calculator

Python is great at math! You can use it to do calculations:

## Math Operators:
- \`+\` Addition
- \`-\` Subtraction
- \`*\` Multiplication
- \`/\` Division
- \`**\` Power (exponent)

## Examples:
\`\`\`python
print(5 + 3)      # 8
print(10 - 4)     # 6
print(6 * 7)      # 42
print(20 / 4)     # 5.0
print(2 ** 3)     # 8 (2 to the power of 3)
\`\`\`
        `
      }
    ],
    
    starterCode: `# Let's do some math!

apples = 5
oranges = 3
total_fruit = apples + oranges

print("I have", total_fruit, "pieces of fruit!")

# Your turn - create your own math!`,
    
    challenges: [
      {
        id: 'math-challenge-1',
        title: 'Shopping Calculator',
        description: 'Calculate the total cost of items',
        instructions: [
          'Create variables for item prices',
          'Add them together',
          'Print the total'
        ],
        hints: [
          'Use + to add numbers',
          'Store the result in a variable',
          'Print the result'
        ],
        testCases: [
          {
            input: null,
            expectedOutput: /\+/,
            description: 'Should use addition'
          }
        ],
        xp_reward: 100
      }
    ]
  }
];

// Blockly lessons for younger kids (5-8)
export const scratchBeginnerCourse: LessonContent[] = [
  {
    id: 'scratch-001',
    title: 'Move the Cat!',
    description: 'Learn to make a sprite move with blocks',
    difficulty: 'beginner',
    ageGroup: '5-8',
    category: 'scratch',
    duration_minutes: 20,
    xp_reward: 100,
    editorType: 'blockly',
    
    sections: [
      {
        id: 'intro',
        type: 'video',
        title: 'Meet Your Coding Blocks!',
        content: 'Learn how to use colorful blocks to make things happen!',
        duration_seconds: 120
      },
      {
        id: 'practice',
        type: 'interactive',
        title: 'Try It!',
        content: 'Drag blocks to make the cat move across the screen!'
      }
    ],
    
    starterBlocks: {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'event_whenflagclicked',
            x: 100,
            y: 100
          }
        ]
      }
    },
    
    challenges: [
      {
        id: 'move-challenge',
        title: 'Make It Move!',
        description: 'Make the sprite move 10 steps',
        instructions: [
          'Find the "move 10 steps" block',
          'Connect it to the flag block',
          'Click the flag to run!'
        ],
        hints: [
          'Look in the Motion category (blue)',
          'Drag the block under the flag',
          'Blocks snap together like LEGO!'
        ],
        testCases: [],
        xp_reward: 50
      }
    ]
  }
];
