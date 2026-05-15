'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Users, 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck,
  Loader2,
  ExternalLink,
  CheckCircle,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Search,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionMessages, setSessionMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const [statsRes, clientsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/clients')
        ]);
        setStats(statsRes.data);
        setClients(clientsRes.data.data);
      } else if (activeTab === 'conversations') {
        const { data } = await api.get('/admin/conversations');
        setConversations(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (clientId, newPlan) => {
    try {
      await api.post(`/admin/clients/${clientId}/plan`, { plan: newPlan });
      fetchAdminData(); // Refresh list
    } catch (err) {
      alert('Failed to update plan');
    }
  };

  const handleOpenReview = async (sessionId) => {
    setSelectedSession(sessionId);
    setLoadingMessages(true);
    try {
      const { data } = await api.get(`/conversations/${sessionId}`);
      setSessionMessages(data);
    } catch (err) {
      console.error('Failed to fetch session transcript');
    } finally {
      setLoadingMessages(false);
    }
  };

  if (loading && !stats && !conversations.length) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent-light)] rounded-3xl border border-[var(--primary-light)] shadow-2xl shadow-[var(--sidebar-active-shadow)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-[var(--foreground)] shadow-lg shadow-[var(--sidebar-active-shadow)]">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-[var(--foreground-muted)]">Manage clients, plans, and platform-wide data.</p>
          </div>
        </div>
        
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-[var(--border)] self-start md:self-center">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--sidebar-active-shadow)]' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('conversations')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'conversations' ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--sidebar-active-shadow)]' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}`}
          >
            <MessageSquare size={18} /> Global Chats
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Clients" value={stats?.total_clients} icon={<Users className="text-[var(--primary)]" />} trend="+12% this month" />
            <StatCard title="Total Agents" value={stats?.total_bots} icon={<Bot className="text-purple-400" />} trend="+5 new today" />
            <StatCard title="Total Messages" value={stats?.total_messages} icon={<MessageSquare className="text-emerald-400" />} trend="89% response rate" />
            <StatCard title="Active Volume" value={Math.floor(stats?.total_messages * 0.1)} icon={<TrendingUp className="text-amber-400" />} trend="Peak traffic now" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card-hover)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-xl">
              <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-bold text-lg">Client Management</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" size={14} />
                    <input type="text" placeholder="Search clients..." className="bg-white/5 border border-[var(--border-strong)] rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-[var(--foreground-muted)]">
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4 text-center">Bots</th>
                      <th className="px-6 py-4">Subscription Plan</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-[var(--input-bg)] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] font-bold text-xs uppercase">{client.name.substring(0, 2)}</div>
                            <div>
                              <p className="text-sm font-semibold">{client.name}</p>
                              <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-tighter">{client.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-mono">{client.bots_count}</span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={client.plan || 'free'} 
                            onChange={(e) => handleUpdatePlan(client.id, e.target.value)}
                            className="bg-white/5 border border-[var(--border-strong)] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--primary)] capitalize"
                          >
                            <option value="free">Free Plan</option>
                            <option value="pro">Pro Plan</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Active
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[var(--card-hover)] rounded-3xl border border-[var(--border)] overflow-hidden flex flex-col shadow-xl">
              <div className="p-6 border-b border-[var(--border)] flex items-center gap-2">
                <BarChart3 size={18} className="text-purple-400" />
                <h3 className="font-bold">Top Performing Bots</h3>
              </div>
              <div className="p-6 flex-1 space-y-6">
                {stats?.top_bots.map((bot) => (
                  <div key={bot.id} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Bot size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{bot.bot_name}</p>
                      <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider">{bot.conversations_count} total messages</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">92%</p>
                      <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-tighter">Health</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white/5 mt-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest font-bold">Platform Load</span>
                  <span className="text-xs font-bold text-[var(--primary)]">78%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--primary)] rounded-full w-[78%]"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-[var(--card-hover)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[var(--border)]">
            <h3 className="font-bold text-lg">Global Conversations Monitor</h3>
            <p className="text-xs text-[var(--foreground-muted)]">Real-time view of all interactions across the platform.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-[var(--foreground-muted)]">
                  <th className="px-6 py-4">Visitor / Lead</th>
                  <th className="px-6 py-4">Assigned Bot</th>
                  <th className="px-6 py-4">Last Interaction</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {conversations.map((conv) => (
                  <tr key={conv.session_id} className="hover:bg-[var(--input-bg)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">{conv.lead?.name || `Visitor ${conv.session_id.substring(0, 8)}`}</p>
                      <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-tighter">{conv.lead?.email || 'Anonymous'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-purple-600/10 flex items-center justify-center text-purple-400"><Bot size={12} /></div>
                        <span className="text-xs font-medium">{conv.bot?.bot_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-[var(--foreground-muted)] truncate max-w-xs">{conv.last_message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] text-[var(--foreground-muted)] uppercase">{new Date(conv.last_message_at).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenReview(conv.session_id)}
                        className="p-2 hover:bg-white/5 rounded-lg text-[var(--primary)] transition-colors"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedSession(null)} />
          <div className="relative w-full max-w-2xl bg-[var(--card)] rounded-3xl border border-[var(--border-strong)] shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Transcript Review</h3>
                <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest">Session: {selectedSession}</p>
              </div>
              <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingMessages ? (
                <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-[var(--primary)]" /></div>
              ) : (
                sessionMessages.map((msg, i) => (
                  <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? '' : 'flex-row-reverse text-right'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/5 text-[var(--foreground-muted)]' : 'bg-[var(--primary-light)] text-[var(--primary)]'}`}>
                      {msg.role === 'user' ? <Users size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${msg.role === 'user' ? 'bg-white/5 text-[var(--foreground-muted)]' : 'bg-[var(--primary)] text-white'}`}>
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-6 bg-white/5 border-t border-[var(--border)] rounded-b-3xl">
              <p className="text-[10px] text-center text-[var(--foreground-muted)] uppercase tracking-widest">End of Transcript</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-[var(--card-hover)] p-6 rounded-3xl border border-[var(--border)] hover:border-[var(--border-strong)] transition-all group shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
        <div className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">{trend}</div>
      </div>
      <p className="text-xs text-[var(--foreground-muted)] font-medium mb-1 uppercase tracking-tighter">{title}</p>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
