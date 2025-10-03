import { useState, useEffect, useRef } from 'react';
import { openAIService, ChatMessage } from '../../services/openai.service';
import { Send, ThumbsUp, ThumbsDown, Sparkles, Loader2, X, Minimize2, Maximize2 } from 'lucide-react';

interface EnhancedAIChatProps {
  studentId: string;
  studentAge?: number;
  currentLesson?: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
}

interface Message extends ChatMessage {
  id: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export const EnhancedAIChat = ({
  studentId,
  studentAge = 10,
  currentLesson,
  isMinimized = false,
  onToggleMinimize,
  onClose
}: EnhancedAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! 👋 I'm your AI coding mentor. I'm here to help you learn and answer questions. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'positive' | 'negative' | null>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    setLoading(true);
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Prepare conversation history for API
    const conversationHistory: ChatMessage[] = messages.slice(-6).map(m => ({
      role: m.role,
      content: m.content
    }));
    conversationHistory.push({ role: 'user', content: userMessage });
    
    // Get AI response
    const response = await openAIService.sendMessage(conversationHistory, {
      studentAge,
      currentLesson
    });
    
    setLoading(false);
    
    // Add AI response
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
  };
  
  const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
    setFeedback(prev => ({
      ...prev,
      [messageId]: prev[messageId] === type ? null : type
    }));
    
    // In production, send this to your analytics/backend
    console.log(`Feedback for message ${messageId}:`, type);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const quickPrompts = [
    "I'm stuck on this challenge",
    "Can you explain variables?",
    "What should I build next?",
    "I got an error, help!"
  ];
  
  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };
  
  if (isMinimized) {
    return (
      <button
        onClick={onToggleMinimize}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-50"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">AI Coding Mentor</h3>
            <p className="text-xs opacity-90">Always here to help!</p>
          </div>
        </div>
        <div className="flex gap-2">
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-900 shadow-sm rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <div className="flex items-center gap-2 mt-1 px-2">
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.role === 'assistant' && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleFeedback(message.id, 'positive')}
                      className={`p-1 rounded transition-colors ${
                        feedback[message.id] === 'positive'
                          ? 'text-green-600 bg-green-100'
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'negative')}
                      className={`p-1 rounded transition-colors ${
                        feedback[message.id] === 'negative'
                          ? 'text-red-600 bg-red-100'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Prompts (show if no messages yet or conversation is short) */}
      {messages.length < 4 && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleQuickPrompt(prompt)}
              className="text-xs bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      
      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about coding..."
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm max-h-24"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
