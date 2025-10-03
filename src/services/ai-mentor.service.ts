/**
 * AI Mentor Service - Intelligent tutoring system
 * Integrates with OpenRouter for conversational AI support (replaces OpenAI)
 */

import { supabase } from '../lib/supabase';
import { AIConversation, ConversationMessage, ConversationContext } from '../types/database.types';

export interface SendMessageParams {
  studentId: string;
  message: string;
  lessonId?: string;
  currentCode?: string;
  errorMessage?: string;
}

export interface AIResponse {
  message: string;
  hints?: string[];
  encouragement?: string;
  suggestedAction?: string;
}

class AIMentorService {
  private readonly apiKey: string;
  private readonly apiEndpoint = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly appUrl: string;
  private readonly appName: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    this.appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
    this.appName = import.meta.env.VITE_APP_NAME || 'CodeKid';
  }

  /**
   * Start a new conversation
   */
  async startConversation(studentId: string, lessonId?: string) {
    try {
      const { data: conversation, error } = await supabase
        .from('ai_conversations')
        .insert({
          student_id: studentId,
          lesson_id: lessonId,
          conversation_history: [],
          context_data: {},
          total_messages: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return { conversation, error: null };
    } catch (error) {
      console.error('Start conversation error:', error);
      return { conversation: null, error };
    }
  }

  /**
   * Get active conversation for student
   */
  async getActiveConversation(studentId: string, lessonId?: string) {
    try {
      let query = supabase
        .from('ai_conversations')
        .select('*')
        .eq('student_id', studentId)
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .limit(1);

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data: conversation, error } = await query.single();

      if (error || !conversation) {
        // Start new conversation if none exists
        return await this.startConversation(studentId, lessonId);
      }

      return { conversation, error: null };
    } catch (error) {
      console.error('Get active conversation error:', error);
      return { conversation: null, error };
    }
  }

  /**
   * Send message to AI mentor
   */
  async sendMessage(params: SendMessageParams): Promise<{ response: AIResponse | null; error: any }> {
    try {
      const startTime = Date.now();

      // Get or create conversation
      const { conversation, error: convError } = await this.getActiveConversation(
        params.studentId,
        params.lessonId
      );

      if (convError || !conversation) throw new Error('Could not get conversation');

      // Get student info for personalization
      const { data: student } = await supabase
        .from('students')
        .select('display_name, age, current_level, interests, preferred_learning_style')
        .eq('id', params.studentId)
        .single();

      // Build context
      const context: ConversationContext = {
        current_lesson: params.lessonId,
        current_code: params.currentCode,
        error_message: params.errorMessage,
        student_level: student?.current_level,
        student_age: student?.age,
        student_interests: student?.interests,
        learning_style: student?.preferred_learning_style,
      };

      // Get AI response
      const aiResponse = await this.callOpenAI(
        params.message,
        conversation.conversation_history || [],
        context,
        student
      );

      // Update conversation history
      const userMessage: ConversationMessage = {
        role: 'user',
        content: params.message,
        timestamp: new Date().toISOString(),
      };

      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [
        ...(conversation.conversation_history || []),
        userMessage,
        assistantMessage,
      ];

      // Save to database
      const { error: updateError } = await supabase
        .from('ai_conversations')
        .update({
          conversation_history: updatedHistory,
          context_data: context,
          total_messages: (conversation.total_messages || 0) + 1,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversation.id);

      if (updateError) throw updateError;

      // Log interaction
      const responseTime = Date.now() - startTime;
      await this.logInteraction(
        conversation.id,
        params.studentId,
        params.message,
        aiResponse.message,
        responseTime
      );

      return { response: aiResponse, error: null };
    } catch (error) {
      console.error('Send message error:', error);
      return { response: null, error };
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(
    userMessage: string,
    history: ConversationMessage[],
    context: ConversationContext,
    student: any
  ): Promise<AIResponse> {
    try {
      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(student, context);

      // Prepare messages for API
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10).map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: userMessage },
      ];

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': this.appUrl, // OpenRouter requires this
          'X-Title': this.appName // Optional: helps with ranking
        },
        body: JSON.stringify({
          model: 'openai/gpt-4', // OpenRouter model format
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiMessage = data.choices[0].message.content;

      return this.parseAIResponse(aiMessage);
    } catch (error) {
      console.error('OpenRouter API error:', error);
      // Fallback response
      return {
        message: "I'm having trouble connecting right now. Would you like to try asking your question in a different way, or would you prefer to speak with a human mentor?",
      };
    }
  }

  /**
   * Build system prompt for AI
   */
  private buildSystemPrompt(student: any, context: ConversationContext): string {
    const age = student?.age || 10;
    const level = student?.current_level || 1;
    const name = student?.display_name || 'friend';

    return `You are CodeKid AI Mentor, a friendly, encouraging, and patient coding tutor for children.

STUDENT PROFILE:
- Name: ${name}
- Age: ${age} years old
- Level: ${level}
- Interests: ${student?.interests?.join(', ') || 'coding'}
- Learning Style: ${student?.preferred_learning_style || 'visual'}

CURRENT CONTEXT:
${context.current_code ? `- Working on code: ${context.current_code.substring(0, 200)}...` : ''}
${context.error_message ? `- Error encountered: ${context.error_message}` : ''}

YOUR ROLE:
1. NEVER give direct answers - guide with questions and hints
2. Use age-appropriate language and analogies
3. Celebrate every small win with enthusiasm
4. If student is struggling, break down the problem into smaller steps
5. Use emojis sparingly to keep things fun 🎉
6. Reference their interests when explaining concepts
7. Encourage experimentation and creativity
8. If stuck for >3 messages, suggest "Connect to Human Mentor"

RESPONSE STYLE:
- Keep responses short (2-3 sentences max)
- Ask guiding questions instead of explaining
- Use real-world examples they can relate to
- Always end with encouragement or a question

SAFETY:
- Never discuss inappropriate topics
- Flag any concerning messages
- Always maintain a positive, supportive tone

Remember: Your goal is to help them DISCOVER the solution, not hand it to them!`;
  }

  /**
   * Parse AI response into structured format
   */
  private parseAIResponse(response: string): AIResponse {
    // Simple parsing - could be enhanced with structured output
    return {
      message: response,
    };
  }

  /**
   * Rate AI response
   */
  async rateResponse(conversationId: string, rating: number, helpful: boolean) {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .update({
          student_satisfaction_rating: rating,
        })
        .eq('id', conversationId);

      if (error) throw error;

      // If rating is low, flag for review
      if (rating <= 2) {
        await supabase
          .from('ai_conversations')
          .update({ flagged_for_review: true })
          .eq('id', conversationId);
      }

      return { error: null };
    } catch (error) {
      console.error('Rate response error:', error);
      return { error };
    }
  }

  /**
   * Escalate to human mentor
   */
  async escalateToHuman(conversationId: string, studentId: string) {
    try {
      // Mark conversation as escalated
      const { error: updateError } = await supabase
        .from('ai_conversations')
        .update({
          escalated_to_human: true,
          flagged_for_review: true,
        })
        .eq('id', conversationId);

      if (updateError) throw updateError;

      // Create notification for instructors
      // This would integrate with your instructor notification system

      // Send notification to parent
      const { data: student } = await supabase
        .from('students')
        .select('parent_id, display_name')
        .eq('id', studentId)
        .single();

      if (student) {
        await supabase.from('parent_notifications').insert({
          parent_id: student.parent_id,
          student_id: studentId,
          notification_type: 'stuck',
          title: `${student.display_name} needs help`,
          message: 'Your child has requested assistance from a human mentor.',
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Escalate to human error:', error);
      return { error };
    }
  }

  /**
   * End conversation
   */
  async endConversation(conversationId: string) {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .update({
          ended_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('End conversation error:', error);
      return { error };
    }
  }

  /**
   * Log interaction for analytics
   */
  private async logInteraction(
    conversationId: string,
    studentId: string,
    studentMessage: string,
    aiResponse: string,
    responseTimeMs: number
  ) {
    try {
      // Determine query type
      const queryType = this.categorizeQuery(studentMessage);

      await supabase.from('ai_mentor_interactions').insert({
        conversation_id: conversationId,
        student_id: studentId,
        query_type: queryType,
        student_message: studentMessage,
        ai_response: aiResponse,
        response_time_ms: responseTimeMs,
        tokens_used: Math.ceil((studentMessage.length + aiResponse.length) / 4), // Rough estimate
      });
    } catch (error) {
      console.error('Log interaction error:', error);
    }
  }

  /**
   * Categorize student query
   */
  private categorizeQuery(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('error') || lowerMessage.includes('bug')) {
      return 'error_help';
    } else if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('why')) {
      return 'concept_explanation';
    } else if (lowerMessage.includes('project') || lowerMessage.includes('idea')) {
      return 'project_idea';
    } else if (lowerMessage.includes('stuck') || lowerMessage.includes('help')) {
      return 'general_help';
    }

    return 'other';
  }

  /**
   * Get conversation analytics
   */
  async getConversationAnalytics(studentId: string, days: number = 7) {
    try {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - days);

      const { data, error } = await supabase
        .from('ai_mentor_interactions')
        .select('*')
        .eq('student_id', studentId)
        .gte('created_at', dateFrom.toISOString());

      if (error) throw error;

      // Calculate metrics
      const totalInteractions = data?.length || 0;
      const avgResponseTime =
        data?.reduce((sum, i) => sum + i.response_time_ms, 0) / totalInteractions || 0;
      const helpfulCount = data?.filter((i) => i.helpful === true).length || 0;

      const queryTypes = data?.reduce((acc, i) => {
        acc[i.query_type] = (acc[i.query_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        data: {
          totalInteractions,
          avgResponseTime,
          helpfulPercentage: totalInteractions > 0 ? (helpfulCount / totalInteractions) * 100 : 0,
          queryTypes,
        },
        error: null,
      };
    } catch (error) {
      console.error('Get conversation analytics error:', error);
      return { data: null, error };
    }
  }
}

export const aiMentorService = new AIMentorService();
