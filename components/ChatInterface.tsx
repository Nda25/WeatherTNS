import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { generateChatResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
    userProfile: UserProfile;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: `مرحباً بك يا ${userProfile.name}! 🤖. أنا هنا لمساعدتك في فهم بيئة ${userProfile.city} بشكل أفضل.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert internal message format to Gemini history format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Pass userProfile to service
      const responseText = await generateChatResponse(history, userMsg.text, userProfile);

      if (responseText) {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: responseText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-purple-50 flex items-center gap-3">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <Bot className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="font-bold text-gray-800">إيكو بوت</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-gray-500">متصل الآن</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-secondary text-white' : 'bg-primary text-white'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-secondary to-pink-500 text-white rounded-tl-none' 
                : 'bg-gray-100 text-gray-800 rounded-tr-none'
            }`}>
              <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                 <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              <p className={`text-[10px] mt-2 opacity-70 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
               <Bot size={20} />
             </div>
             <div className="bg-gray-50 rounded-2xl p-4 rounded-tr-none flex items-center gap-2">
               <Loader2 size={16} className="animate-spin text-gray-400" />
               <span className="text-sm text-gray-500">جاري الكتابة...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك هنا..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-purple-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} className="rtl:rotate-180" />}
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
          <Sparkles size={12} />
          الردود تولد بواسطة الذكاء الاصطناعي (Gemini)
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
