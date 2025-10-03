// OpenRouter API Service for AI Mentor (replaces OpenAI)
import { env } from '../lib/env';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  message: string;
  error?: string;
}

// System prompt for the AI Mentor
const SYSTEM_PROMPT = `You are a friendly, encouraging AI coding mentor for kids aged 5-16. Your role is to:

1. **Never give direct answers** - Guide students to discover solutions themselves through questions
2. **Be encouraging** - Celebrate small wins and progress
3. **Adapt to age** - Use age-appropriate language and analogies
4. **Stay positive** - Frame mistakes as learning opportunities
5. **Be patient** - Break down complex concepts into simple steps
6. **Use examples** - Relate coding concepts to real-world things kids understand
7. **Safety first** - Only discuss coding topics, redirect off-topic questions

Example responses:
- Student: "I don't understand variables"
  You: "Great question! 🎯 Think of variables like labeled boxes. What would you put in a box labeled 'favorite_color'? Once you tell me, I'll help you understand how it works in code!"

- Student: "My code won't run"
  You: "No worries! Debugging is a superpower all coders learn. 🔍 Let's be detectives together! First, can you tell me what you're trying to make your code do?"

- Student: "This is too hard"
  You: "I totally get it - learning new things can feel tricky at first! 💪 But guess what? You've already learned so much! Remember when [previous achievement]? Let's break this into tiny steps. What's the FIRST small thing we could try?"

Keep responses:
- Short (2-3 sentences max)
- Friendly with occasional emojis
- Focused on questions that lead to understanding
- Specific to the student's current lesson/challenge

Remember: You're not just a helper - you're a mentor building confidence and problem-solving skills!`;

class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://openrouter.ai/api/v1';
  
  constructor() {
    this.apiKey = env.openrouterApiKey;
  }
  
  /**
   * Send a chat message to OpenAI and get a response
   */
  async sendMessage(
    messages: ChatMessage[],
    context?: {
      studentAge?: number;
      currentLesson?: string;
      strugglingWith?: string;
    }
  ): Promise<AIResponse> {
    if (!this.apiKey || this.apiKey === '') {
      return {
        message: "Hi! I'm your AI mentor, but I need an API key to be fully activated. For now, try the lessons and challenges - they're super fun! 🚀",
        error: 'No API key configured'
      };
    }
    
    try {
      // Add context to system prompt if available
      let contextualPrompt = SYSTEM_PROMPT;
      if (context) {
        if (context.studentAge) {
          contextualPrompt += `\n\nStudent age: ${context.studentAge} years old`;
        }
        if (context.currentLesson) {
          contextualPrompt += `\n\nCurrent lesson: ${context.currentLesson}`;
        }
        if (context.strugglingWith) {
          contextualPrompt += `\n\nStudent is currently struggling with: ${context.strugglingWith}`;
        }
      }
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': env.appUrl, // OpenRouter requires this
          'X-Title': env.appName // Optional: helps with ranking
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo', // OpenRouter model format
          messages: [
            { role: 'system', content: contextualPrompt },
            ...messages
          ],
          max_tokens: 200, // Keep responses concise
          temperature: 0.7, // Balance creativity and consistency
          presence_penalty: 0.6, // Encourage varied responses
          frequency_penalty: 0.3
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('OpenRouter API error:', error);
        return {
          message: "Oops! I'm having trouble connecting right now. Try asking me again in a moment! 🔄",
          error: error.error?.message || 'API request failed'
        };
      }
      
      const data = await response.json();
      const aiMessage = data.choices[0]?.message?.content || "I didn't quite catch that. Can you try asking again?";
      
      return {
        message: aiMessage.trim()
      };
      
    } catch (error: any) {
      console.error('OpenRouter service error:', error);
      return {
        message: "Sorry, I'm having a little trouble right now. Let's try again! 🤔",
        error: error.message
      };
    }
  }
  
  /**
   * Get a hint for a specific challenge
   */
  async getHint(
    challengeDescription: string,
    studentCode: string,
    attemptNumber: number
  ): Promise<AIResponse> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `I'm working on: "${challengeDescription}"

My current code is:
\`\`\`
${studentCode}
\`\`\`

This is my attempt #${attemptNumber}. Can you give me a hint without giving away the answer?`
      }
    ];
    
    return this.sendMessage(messages);
  }
  
  /**
   * Explain an error in kid-friendly language
   */
  async explainError(
    code: string,
    errorMessage: string,
    studentAge: number
  ): Promise<AIResponse> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `I got this error in my code:

Error: ${errorMessage}

My code:
\`\`\`
${code}
\`\`\`

Can you help me understand what went wrong?`
      }
    ];
    
    return this.sendMessage(messages, { studentAge });
  }
  
  /**
   * Suggest a project based on student interests
   */
  async suggestProject(
    interests: string[],
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<AIResponse> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `I'm interested in: ${interests.join(', ')}
My skill level is: ${skillLevel}

Can you suggest a fun coding project I could build?`
      }
    ];
    
    return this.sendMessage(messages);
  }
}

export const openAIService = new OpenAIService();
