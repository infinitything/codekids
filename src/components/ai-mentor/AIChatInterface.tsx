import { useState, useEffect, useRef } from 'react';
import { aiMentorService } from '../../services/ai-mentor.service';
import { ConversationMessage } from '../../types/database.types';
import { Send, ThumbsUp, ThumbsDown, AlertCircle, Loader2 } from 'lucide-react';

interface AIChatInterfaceProps {
  studentId: string;
  lessonId?: string;
  onNewMessage?: () => void;
}

export const AIChatInterface = ({ studentId, lessonId, onNewMessage }: AIChatInterfaceProps) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversation();
  }, [studentId, lessonId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    const { conversation } = await aiMentorService.getActiveConversation(studentId, lessonId);
    if (conversation) {
      setConversationId(conversation.id);
      setMessages(conversation.conversation_history || []);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setLoading(true);

    // Add user message immediately
    const newUserMessage: ConversationMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newUserMessage]);

    // Send to AI
    const { response, error } = await aiMentorService.sendMessage({
      studentId,
      message: userMessage,
      lessonId,
    });

    setLoading(false);

    if (response) {
      const aiMessage: ConversationMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      onNewMessage?.();
    } else if (error) {
      const errorMessage: ConversationMessage = {
        role: 'assistant',
        content: "I'm having trouble right now. Please try again or ask a teacher for help!",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleRating = async (messageIndex: number, helpful: boolean) => {
    if (!conversationId) return;
    await aiMentorService.rateResponse(conversationId, helpful ? 5 : 1, helpful);
  };

  const handleEscalate = async () => {
    if (!conversationId) return;
    await aiMentorService.escalateToHuman(conversationId, studentId);
    
    const escalateMessage: ConversationMessage = {
      role: 'assistant',
      content: "I've notified a human mentor! They'll help you soon. In the meantime, keep trying - you're doing great! 💪",
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, escalateMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">👋</div>
            <p className="text-gray-600 mb-2">Hi! I'm your AI coding mentor!</p>
            <p className="text-sm text-gray-500">
              Ask me anything about coding, and I'll help you figure it out! 🚀
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🤖</span>
                  <span className="text-xs font-semibold text-gray-600">AI Mentor</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {message.role === 'assistant' && index === messages.length - 1 && !loading && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleRating(index, true)}
                    className="text-xs text-gray-600 hover:text-green-600 flex items-center gap-1"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Helpful
                  </button>
                  <button
                    onClick={() => handleRating(index, false)}
                    className="text-xs text-gray-600 hover:text-red-600 flex items-center gap-1"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    Not helpful
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
              <span className="text-sm text-gray-600">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Escalate Button */}
      <div className="px-4 pb-2">
        <button
          onClick={handleEscalate}
          className="w-full text-xs text-orange-600 hover:text-orange-700 flex items-center justify-center gap-1 py-2"
        >
          <AlertCircle className="w-3 h-3" />
          Still stuck? Connect to human mentor
        </button>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about coding..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className="w-12 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
