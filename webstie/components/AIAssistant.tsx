
import React, { useState, useRef, useEffect } from 'react';
import { Article, ChatMessage } from '../types';
import { createArticleChat } from '../services/geminiService';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, articles }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: '您好！我是WeCurate AI助手。我可以根据库中的专业内容为您答疑解惑，或者帮您总结特定话题。请问有什么我可以帮您的？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Re-initialize chat with new context when articles change or assistant opens
    if (isOpen && articles.length > 0) {
      const context = articles.map(a => `[${a.category}] ${a.title} (作者: ${a.author}): ${a.summary}`).join('\n');
      chatRef.current = createArticleChat(context);
    }
  }, [isOpen, articles]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        const context = articles.map(a => `[${a.category}] ${a.title}: ${a.summary}`).join('\n');
        chatRef.current = createArticleChat(context);
      }

      const response = await chatRef.current.sendMessage({ message: input });
      const modelMsg: ChatMessage = { role: 'model', content: response.text || '对不起，我现在无法回答。' };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: '请求超时或发生错误，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-100">
      <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-sm">AI 专家助手</h3>
            <p className="text-[10px] text-indigo-100">基于库内内容实时解答</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-indigo-500 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white border border-slate-200 text-indigo-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="提问，例如：总结一下科技类的文章"
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
