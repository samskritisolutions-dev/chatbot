'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, X, Minimize2 } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function WidgetPage() {
  const { botUid } = useParams();
  const [config, setConfig] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const scrollRef = useRef(null);

  // Initialize session and config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/widget/${botUid}/config`);
        setConfig(data);
        setMessages([{ role: 'assistant', message: data.welcome_msg }]);
      } catch (err) {
        console.error('Failed to load widget config');
      }
    };

    let sid = localStorage.getItem(`chat_session_${botUid}`);
    if (!sid) {
      sid = Math.random().toString(36).substring(7);
      localStorage.setItem(`chat_session_${botUid}`, sid);
    }
    setSessionId(sid);
    fetchConfig();
  }, [botUid]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', message: userMsg }]);
    setLoading(true);

    try {
      const { data } = await axios.post(`http://localhost:8000/api/widget/${botUid}/chat`, {
        session_id: sessionId,
        message: userMsg
      });
      setMessages(prev => [...prev, { role: 'assistant', message: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', message: "I'm having trouble connecting to my brain right now. Please try again later!" }]);
    } finally {
      setLoading(false);
    }
  };

  if (!config) return null;

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900 overflow-hidden shadow-2xl">
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between text-white shadow-lg z-10" 
        style={{ backgroundColor: config.widget_color || '#2563eb' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10 overflow-hidden">
            {config.avatar_url ? (
              <img src={config.avatar_url} alt="Bot" className="w-full h-full object-cover" />
            ) : (
              <Bot size={20} />
            )}
          </div>
          <div>
            <h1 className="font-bold text-sm">{config.bot_name}</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] opacity-80 uppercase tracking-widest font-semibold">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all"><Minimize2 size={16} /></button>
          <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all"><X size={16} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[var(--primary)] text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-slide-up">
            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Type your message..."
            className="w-full bg-gray-100 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 text-[var(--primary)] hover:scale-110 disabled:opacity-30 disabled:scale-100 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <Sparkles size={10} className="text-gray-400" />
          <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Powered by Antigravity AI</p>
        </div>
      </form>
    </div>
  );
}
