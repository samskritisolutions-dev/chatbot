'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Bot, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Settings, 
  Trash2,
  Loader2,
  Search,
  Zap,
  Code,
  Palette,
  MessageSquare,
  Users,
  ArrowUpRight,
  Activity,
  Play
} from 'lucide-react';
import CreateBotModal from '@/components/CreateBotModal';
import EmbedModal from '@/components/EmbedModal';
import AppearanceModal from '@/components/AppearanceModal';

export default function BotsPage() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBots = async () => {
    try {
      const { data } = await api.get('/bots');
      setBots(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Failed to fetch bots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bot? This action cannot be undone.')) return;
    try {
      await api.delete(`/bots/${id}`);
      setBots(bots.filter(b => b.id !== id));
    } catch (err) {
      alert('Failed to delete bot');
    }
  };

  const filteredBots = bots.filter(bot => 
    bot.bot_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            My AI Agents
            <span className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-[var(--primary-light)]">
              {bots.length} Active
            </span>
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm font-medium">Create, manage, and monitor your intelligent workforce.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-[var(--sidebar-active-shadow)] group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Create New Bot
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search by agent name or instructions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-[var(--primary-light)] transition-all placeholder:text-[var(--foreground-subtle)] relative z-10"
        />
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-[var(--foreground-muted)] font-bold text-xs uppercase tracking-widest animate-pulse">Initializing Neural Links...</p>
        </div>
      ) : filteredBots.length === 0 ? (
        <div className="p-20 rounded-[40px] bg-[var(--card)] border border-[var(--border)] flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-3xl bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] mb-8 border border-[var(--primary-light)]">
            <Bot size={48} className="animate-float" />
          </div>
          <h2 className="text-2xl font-black mb-3">No Agents Found</h2>
          <p className="text-[var(--foreground-muted)] mb-10 max-w-sm font-medium">
            {searchQuery ? "We couldn't find any bots matching your search criteria." : "You haven't created any AI agents yet. Start by deploying your first intelligent bot."}
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all border border-[var(--border)] flex items-center gap-3"
          >
            Deploy Your First Agent <ArrowUpRight size={18} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBots.map((bot) => (
            <BotCard 
              key={bot.id} 
              bot={bot} 
              onDelete={() => handleDelete(bot.id)} 
              onEmbed={() => { setSelectedBot(bot); setShowEmbed(true); }}
              onAppearance={() => { setSelectedBot(bot); setShowAppearance(true); }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateBotModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchBots} 
      />

      {showAppearance && selectedBot && (
        <AppearanceModal 
          bot={selectedBot} 
          isOpen={true}
          onClose={() => { setShowAppearance(false); setSelectedBot(null); }}
          onSuccess={fetchBots}
        />
      )}

      {showEmbed && selectedBot && (
        <EmbedModal 
          bot={selectedBot} 
          onClose={() => { setShowEmbed(false); setSelectedBot(null); }} 
        />
      )}
    </div>
  );
}

function BotCard({ bot, onDelete, onEmbed, onAppearance }) {
  return (
    <div className="group relative">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-[32px] blur opacity-0 group-hover:opacity-10 transition duration-500" />
      
      <div className="relative p-8 rounded-[32px] bg-[var(--card)] border border-[var(--border)] group-hover:border-[var(--primary-light)] transition-all duration-300">
        <div className="flex items-start justify-between mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-[var(--border)] flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform duration-500">
            <Bot size={32} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
              bot.is_active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' : 'bg-red-500/10 text-red-500 border border-red-500/10'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${bot.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              {bot.is_active ? 'Operational' : 'Offline'}
            </div>
            <div className="text-[10px] font-bold text-[var(--foreground-subtle)] uppercase tracking-tighter">
               UID: {bot.bot_uid.substring(0, 8)}...
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-black mb-2 group-hover:text-[var(--primary)] transition-colors">{bot.bot_name}</h3>
          <p className="text-sm text-[var(--foreground-muted)] font-medium line-clamp-2 h-10 leading-relaxed">
            {bot.system_prompt || 'No system instructions provided yet.'}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="p-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)]">
              <div className="flex items-center gap-2 text-[var(--foreground-muted)] mb-1">
                 <MessageSquare size={12} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Messages</span>
              </div>
              <div className="text-lg font-black">{bot.conversations_count || 0}</div>
           </div>
           <div className="p-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)]">
              <div className="flex items-center gap-2 text-[var(--foreground-muted)] mb-1">
                 <Activity size={12} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Status</span>
              </div>
              <div className="text-lg font-black text-emerald-500">Good</div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onEmbed}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-[var(--primary)] text-white py-4 rounded-2xl text-[11px] font-bold transition-all duration-300 group/btn border border-[var(--border)]"
            >
              <Code size={16} />
              Embed
            </button>
            <button 
              onClick={onAppearance}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-purple-600 py-4 rounded-2xl text-[11px] font-bold transition-all duration-300 border border-[var(--border)]"
            >
              <Palette size={16} />
              Bot UI
            </button>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={() => window.location.href = `/dashboard/training?bot=${bot.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-4 rounded-2xl text-[11px] font-bold transition-all duration-300 border border-[var(--border)]"
              >
                <Zap size={16} className="text-yellow-500" />
                Train Bot
              </button>
              <button 
                onClick={onDelete}
                className="p-4 bg-white/5 hover:bg-red-500/20 text-[var(--foreground-muted)] hover:text-red-500 rounded-2xl transition-all border border-[var(--border)]"
                title="Delete Agent"
              >
                <Trash2 size={16} />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
