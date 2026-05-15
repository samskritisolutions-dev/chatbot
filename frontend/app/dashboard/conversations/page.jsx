'use client';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { 
  MessageSquare, 
  User, 
  Bot, 
  Search, 
  Filter, 
  Calendar,
  ChevronRight,
  Loader2,
  Send,
  Zap,
  ZapOff,
  ChevronLeft,
  Activity,
  Shield,
  Circle,
  MoreVertical,
  ArrowDown
} from 'lucide-react';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isHumanControlled, setIsHumanControlled] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const scrollRef = useRef(null);
  const selectedSessionRef = useRef(null); // Tracks active session inside intervals

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000); // Poll for new chats
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Live-poll messages for the open conversation every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedSessionRef.current) {
        fetchMessages(selectedSessionRef.current, true); // silent = true
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/conversations');
      setConversations(data.data || []);
    } catch (err) {
      console.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (session, silent = false) => {
    try {
      const { data } = await api.get(`/conversations/${session}`);
      // API returns { messages: [...], taken_over: bool }
      setMessages(data.messages || data || []);
      setIsHumanControlled(data.taken_over ?? false);
      if (!silent) {
        setSelectedSession(session);
        selectedSessionRef.current = session;
        setShowMobileChat(true);
      }
    } catch (err) {
      if (!silent) console.error('Failed to fetch messages');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim() || isSending) return;

    setIsSending(true);
    try {
      const botUid = messages[0]?.bot_uid;
      const { data } = await api.post(`/conversations/${selectedSession}/reply`, {
        message: newReply,
        bot_uid: botUid
      });
      setMessages([...messages, data]);
      setNewReply('');
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const toggleTakeover = async () => {
    try {
      await api.post(`/conversations/${selectedSession}/takeover`);
      setIsHumanControlled(!isHumanControlled);
    } catch (err) {
      console.error('Takeover failed');
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.lead?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.session_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)] bg-[var(--card)] rounded-[20px] border border-[var(--border)] overflow-hidden animate-fade-in relative shadow-2xl">
      
      {/* Sidebar: Conversations List */}
      <div className={`w-full lg:w-[400px] border-r border-[var(--border)] flex flex-col bg-[var(--card)] ${showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-8 border-b border-[var(--border)] space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black flex items-center gap-3">
               Live Feed
               <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
               </span>
             </h2>
             <button className="p-2 text-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors">
                <Filter size={20} />
             </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter identities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-strong)] rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-[var(--primary-light)] transition-all text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
              <p className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest">Scanning Network...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Activity className="text-[var(--foreground-subtle)] mb-4" size={48} />
              <p className="text-xs font-black text-[var(--foreground-subtle)] uppercase tracking-widest">No Active Channels</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button 
                key={conv.session_id}
                onClick={() => fetchMessages(conv.session_id)}
                className={`w-full p-8 py-4 text-left border-b border-[var(--border)] hover:bg-[var(--input-bg)] transition-all flex items-start gap-5 relative group ${
                  selectedSession === conv.session_id ? 'bg-[var(--primary-light)]' : ''
                }`}
              >
                {selectedSession === conv.session_id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)] shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                )}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border transition-all duration-500 ${
                   selectedSession === conv.session_id ? 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--primary-light)]' : 'bg-[var(--input-bg)] text-[var(--foreground-muted)] border-[var(--border)]'
                }`}>
                  {conv.lead?.name ? conv.lead.name.charAt(0).toUpperCase() : <User size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className={`text-sm font-black truncate transition-colors ${selectedSession === conv.session_id ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                      {conv.lead?.name || `Visitor_${conv.session_id.substring(0, 5)}`}
                    </p>
                    <span className="text-[10px] text-[var(--foreground-subtle)] font-black uppercase tracking-tighter">
                      {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)] font-medium truncate leading-relaxed">
                    {conv.last_message || 'Session established...'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className={`flex-1 flex flex-col bg-[var(--card)] relative ${showMobileChat ? 'flex' : 'hidden lg:flex'}`}>
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-6 lg:p-8 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)]/80 backdrop-blur-xl relative z-20">
              <div className="flex items-center gap-5 min-w-0">
                <button 
                  onClick={() => setShowMobileChat(false)}
                  className="p-2 -ml-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] lg:hidden"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] border border-[var(--primary-light)] shadow-lg shadow-[var(--sidebar-active-shadow)]">
                  <MessageSquare size={24} />
                </div>
                <div className="truncate">
                  <h3 className="text-lg font-black text-[var(--foreground)] truncate flex items-center gap-2">
                    {conversations.find(c => c.session_id === selectedSession)?.lead?.name || `Interactive_Channel_${selectedSession.substring(0, 5)}`}
                    <Circle size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-[var(--foreground-subtle)] font-black uppercase tracking-widest truncate">
                    {conversations.find(c => c.session_id === selectedSession)?.lead?.email || 'Anonymous Security Context'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <button className="hidden sm:flex p-3 text-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors">
                    <MoreVertical size={20} />
                 </button>
                 <button 
                  onClick={toggleTakeover}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all shadow-2xl ${
                    isHumanControlled 
                      ? 'bg-amber-500 text-black shadow-amber-500/20' 
                      : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-[var(--sidebar-active-shadow)] border border-[var(--primary-light)]'
                  }`}
                >
                  {isHumanControlled ? <ZapOff size={16} /> : <Zap size={16} />}
                  <span>{isHumanControlled ? 'Human Active' : 'Human Takeover'}</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
               ref={scrollRef}
               className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-10 custom-scrollbar relative"
            >
               {/* Background Texture */}
               <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
               
               <div className="text-center mb-16 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -z-10" />
                  <span className="bg-[var(--card)] px-6 text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-[0.3em] inline-block">Neural Handshake Initiated</span>
               </div>

              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-6 ${msg.role === 'user' ? '' : 'flex-row-reverse'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border ${
                    msg.role === 'user' ? 'bg-[var(--input-bg)] text-[var(--foreground-muted)] border-[var(--border)]' : 'bg-[var(--primary)] text-white border-[var(--primary-light)]'
                  }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`group relative max-w-[80%] lg:max-w-xl p-5 lg:p-6 rounded-[28px] ${
                    msg.role === 'user' ? 'bg-[var(--input-bg)] text-[var(--foreground)] rounded-tl-none border border-[var(--border)]' : 'bg-[var(--primary-light)] text-[var(--foreground)] rounded-tr-none border border-[var(--primary-light)] shadow-xl shadow-[var(--primary-light)]'
                  }`}>
                    <p className="text-[13px] lg:text-sm font-medium leading-relaxed">{msg.message}</p>
                    <div className={`absolute bottom-[-24px] flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user' ? 'left-0' : 'right-0'}`}>
                       <span className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-tighter">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isHumanControlled && (
                <div className="flex justify-center animate-bounce">
                   <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <ArrowDown size={14} /> Direct Uplink Ready
                   </div>
                </div>
              )}
            </div>

            {/* Input Console */}
            <div className="p-4 lg:p-4 bg-[var(--card)] border-t border-[var(--border)] relative z-20">
              <form onSubmit={handleSendReply} className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-[32px] blur opacity-0 transition-opacity duration-500 ${isHumanControlled ? 'group-focus-within:opacity-20' : ''}`} />
                
                <div className="relative flex items-center gap-4">
                   <input 
                    type="text" 
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder={isHumanControlled ? "Transmitting direct response..." : "Initialize human takeover to intervene"}
                    disabled={!isHumanControlled}
                    className="flex-1 bg-[var(--input-bg)] border border-[var(--border-strong)] rounded-[30px] px-8 py-5 text-sm font-bold focus:outline-none focus:border-[var(--primary-light)] disabled:opacity-30 disabled:cursor-not-allowed transition-all placeholder:text-[var(--foreground-subtle)]"
                  />
                  <button 
                    type="submit"
                    disabled={!isHumanControlled || isSending || !newReply.trim()}
                    className={`p-5 rounded-[24px] transition-all shadow-2xl disabled:opacity-20 ${
                      isHumanControlled ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-[var(--sidebar-active-shadow)]' : 'bg-white/5 text-[var(--foreground-subtle)]'
                    }`}
                  >
                    {isSending ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                  </button>
                </div>
              </form>
              <div className="mt-4 flex items-center gap-6 justify-center">
                 <div className="flex items-center gap-2">
                    <Shield size={12} className="text-[var(--foreground-subtle)]" />
                    <span className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest">End-to-End Encrypted</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Bot size={12} className="text-[var(--foreground-subtle)]" />
                    <span className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest">AI Hybrid Mode</span>
                 </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-24">
            <div className="w-32 h-32 rounded-[40px] bg-[var(--primary-light)] border border-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] mb-10 shadow-inner shadow-[var(--primary-light)] relative">
               <div className="absolute inset-0 bg-[var(--primary-hover)]/5 blur-2xl rounded-full" />
               <MessageSquare size={56} className="relative z-10 animate-float" />
            </div>
            <h3 className="text-3xl font-black mb-4">Select Communication Channel</h3>
            <p className="text-[var(--foreground-muted)] max-w-sm text-sm font-medium leading-relaxed">
              Initialize a neural link with any active conversation to monitor intelligence flow or take direct manual control.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
               <div className="p-4 rounded-3xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center gap-3">
                  <Activity className="text-[var(--primary)]" size={16} />
                  <span className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest">Real-time Stream</span>
               </div>
               <div className="p-4 rounded-3xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center gap-3">
                  <Zap className="text-amber-500" size={16} />
                  <span className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest">Instant Takeover</span>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
