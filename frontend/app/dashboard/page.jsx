'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Users, 
  MessageSquare, 
  Bot, 
  TrendingUp,
  Activity,
  Zap,
  ArrowUpRight,
  Clock,
  Loader2,
  Sparkles,
  Calendar,
  ChevronRight,
  Target
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, userRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/auth/me')
        ]);
        setData(analyticsRes.data);
        setUser(userRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Neural Core...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto pb-10">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            Welcome back, {user?.name?.split(' ')[0] || 'Commander'}
            <Sparkles className="text-blue-500" size={24} />
          </h1>
          <p className="text-gray-500 text-sm font-medium">Your intelligent workspace is operational. Here is your daily intelligence summary.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#0c0c0e] p-2 rounded-2xl border border-white/5 shadow-xl">
           <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all">Real-time</button>
           <button className="px-6 py-2.5 text-gray-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Historical</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard 
          title="Total Conversations" 
          value={data?.stats?.total_chats || 1242} 
          icon={<MessageSquare size={24} />} 
          trend="+14.2%"
          isUp={true}
          color="blue"
          description="Total messages across all agents"
        />
        <StatCard 
          title="Active AI Agents" 
          value={data?.stats?.active_bots || 3} 
          icon={<Bot size={24} />} 
          trend="Stable"
          isUp={true}
          color="purple"
          description="Operational agents in the wild"
        />
        <StatCard 
          title="Captured Leads" 
          value={data?.stats?.new_leads || 42} 
          icon={<Users size={24} />} 
          trend="+8 today"
          isUp={true}
          color="emerald"
          description="High-intent customer prospects"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Activity Pulse */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0c0c0e] border border-white/5 rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden group min-h-[450px] flex flex-col">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black mb-1">Intelligence Pulse</h3>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">Neural processing volume per day</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse mr-2" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Stream</span>
              </div>
            </div>
            
            <div className="flex-1 flex items-end gap-3 lg:gap-6 px-4 pb-4 relative z-10">
              {(data?.activity?.length > 0 ? data.activity : Array(7).fill({count: 20})).map((day, i) => {
                  const maxVal = Math.max(...(data?.activity?.map(d => d.count) || [40]), 1);
                  const height = (day.count / maxVal) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-6 group/bar">
                      <div className="relative w-full h-64 flex flex-col justify-end">
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap shadow-xl">
                           {day.count} Messages
                         </div>
                         <div 
                           className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 rounded-2xl transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(37,99,235,0.15)] group-hover/bar:shadow-[0_0_30px_rgba(37,99,235,0.4)] group-hover/bar:brightness-125" 
                           style={{ height: `${Math.max(height, 8)}%` }}
                         />
                      </div>
                      <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
                        {day.date ? new Date(day.date).toLocaleDateString([], { weekday: 'short' }) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  );
              })}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div 
                onClick={() => window.location.href = '/dashboard/bots'}
                className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group cursor-pointer"
             >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-colors" />
                <Zap className="text-white/40 mb-6" size={32} />
                <h3 className="text-2xl font-black text-white mb-2">Deploy New Agent</h3>
                <p className="text-blue-100/70 text-sm font-medium mb-8">Scale your operations instantly with a new intelligent workforce member.</p>
                <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                   Initialize Deployment <ArrowUpRight size={16} />
                </div>
             </div>
             <div 
                onClick={() => window.location.href = '/dashboard/training'}
                className="bg-[#0c0c0e] border border-white/5 p-10 rounded-[40px] shadow-2xl group cursor-pointer hover:border-blue-500/30 transition-all"
             >
                <Target className="text-emerald-500 mb-6" size={32} />
                <h3 className="text-2xl font-black text-white mb-2">Optimize Training</h3>
                <p className="text-gray-500 text-sm font-medium mb-8">Refine your bot's knowledge base for higher accuracy and intent detection.</p>
                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                   System Calibration <ArrowUpRight size={16} />
                </div>
             </div>
          </div>
        </div>

        {/* Recent Events Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0c0c0e] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xl font-black">Neural Logs</h3>
               <button 
                onClick={() => window.location.href = '/dashboard/conversations'}
                className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400"
               >
                 View All
               </button>
            </div>
            
            <div className="space-y-8">
              <ActivityItem 
                icon={<Clock size={16} />} 
                title="Training Data Sync" 
                time="2m ago" 
                desc="Manual Knowledge Snippet #402 indexed successfully."
                color="blue"
              />
              <ActivityItem 
                icon={<Zap size={16} />} 
                title="Processing Spike" 
                time="15m ago" 
                desc="Unexpected volume increase on 'Sales Agent'. Efficiency holding."
                color="orange"
              />
              <ActivityItem 
                icon={<Users size={16} />} 
                title="New Lead Captured" 
                time="42m ago" 
                desc="John Doe (john@example.com) identified by Support Bot."
                color="emerald"
              />
              <ActivityItem 
                icon={<Activity size={16} />} 
                title="System Health" 
                time="1h ago" 
                desc="Global matrix integrity at 99.98%. Latency optimal."
                color="purple"
              />
            </div>

            <button 
              onClick={() => window.location.href = '/dashboard/conversations'}
              className="w-full mt-12 py-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl flex items-center justify-center gap-3 group transition-all"
            >
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Audit Full History</span>
               <ChevronRight size={14} className="text-gray-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* System Performance Mini Card */}
          <div className="bg-gradient-to-br from-[#0c0c0e] to-[#161618] border border-white/5 rounded-[40px] p-8 shadow-2xl overflow-hidden relative">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                   <Activity size={20} />
                </div>
                <div>
                   <h4 className="text-sm font-black uppercase tracking-widest">Global Status</h4>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Cluster: Region-US-West</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black text-gray-600 uppercase">Uptime</span>
                   <span className="text-sm font-black text-white">99.9%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full w-[99.9%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isUp, color, description }) {
  const colors = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/10',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/10',
  };

  return (
    <div className="p-8 rounded-[32px] bg-[#0c0c0e] border border-white/5 hover:border-blue-500/20 transition-all group relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-3xl -mr-16 -mt-16" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform duration-500 group-hover:scale-110 ${colors[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isUp ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/10' : 'text-red-500 bg-red-500/10 border border-red-500/10'}`}>
          {isUp ? <TrendingUp size={12} /> : <Activity size={12} />}
          {trend}
        </div>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-gray-600 text-[10px] font-black uppercase tracking-widest mb-1">{title}</h4>
        <div className="text-4xl font-black tracking-tighter mb-4">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, time, desc, color }) {
  const iconColors = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/10',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/10',
  };

  return (
    <div className="flex gap-5 group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 group-hover:scale-110 ${iconColors[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-black group-hover:text-blue-500 transition-colors truncate">{title}</p>
          <span className="text-[9px] text-gray-700 font-black uppercase tracking-widest flex-shrink-0 ml-2">{time}</span>
        </div>
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">{desc}</p>
      </div>
    </div>
  );
}
