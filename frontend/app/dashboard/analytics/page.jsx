'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Bot,
  Filter,
  Calendar
} from 'lucide-react';

const MOCK_DAILY_STATS = [
  { day: 'Mon', messages: 420, users: 120, conversion: 15 },
  { day: 'Tue', messages: 550, users: 145, conversion: 18 },
  { day: 'Wed', messages: 480, users: 130, conversion: 14 },
  { day: 'Thu', messages: 700, users: 190, conversion: 22 },
  { day: 'Fri', messages: 620, users: 170, conversion: 19 },
  { day: 'Sat', messages: 350, users: 95, conversion: 12 },
  { day: 'Sun', messages: 280, users: 80, conversion: 10 },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/analytics');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch analytics');
      // Using mock stats for demo
      setStats({
        total_messages: 3402,
        total_users: 942,
        avg_response_time: '1.4s',
        conversion_rate: '18.4%'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      {/* Premium Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative space-y-10 animate-fade-in max-w-7xl mx-auto pb-20 px-6 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-hover)]/10 border border-[var(--primary-light)] text-[var(--primary)] text-[10px] font-black uppercase tracking-widest">
              <Activity size={12} />
              Live System Status
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-2">
              Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Insights</span>
            </h1>
            <p className="text-[var(--foreground-muted)] text-sm font-medium max-w-md leading-relaxed">Real-time intelligence and neural activity overview for your AI workforce.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="bg-[var(--card)]/50 backdrop-blur-xl border border-[var(--border)] text-gray-400 font-bold px-6 py-4 rounded-2xl flex items-center gap-2 hover:text-white hover:border-[var(--border-strong)] transition-all">
                <Filter size={16} />
                Advanced Filter
             </button>
             <button className="bg-[var(--primary)] text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 shadow-2xl shadow-[var(--sidebar-active-shadow)] hover:scale-105 active:scale-95 transition-all">
                <Calendar size={16} />
                Last 7 Days
             </button>
          </div>
        </div>

        {/* Hero Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Messages" 
            value={stats?.total_messages || '3,402'} 
            trend="+12.4%" 
            isUp={true} 
            icon={<MessageSquare size={22} />} 
            color="blue"
          />
          <StatCard 
            title="Active Users" 
            value={stats?.total_users || '942'} 
            trend="+5.2%" 
            isUp={true} 
            icon={<Users size={22} />} 
            color="purple"
          />
          <StatCard 
            title="Response Time" 
            value={stats?.avg_response_time || '1.4s'} 
            trend="-0.2s" 
            isUp={true} 
            icon={<Clock size={22} />} 
            color="emerald"
          />
          <StatCard 
            title="Conversion Rate" 
            value={stats?.conversion_rate || '18.4%'} 
            trend="-1.4%" 
            isUp={false} 
            icon={<TrendingUp size={22} />} 
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Section */}
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-[var(--card)]/40 backdrop-blur-3xl border border-[var(--border)] rounded-[48px] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--primary-light)] rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-[var(--primary-light)] transition-colors duration-1000" />
                
                <div className="flex items-center justify-between mb-12 relative z-10">
                   <div>
                      <h3 className="text-2xl font-black mb-1">Neural Activity</h3>
                      <p className="text-[var(--foreground-muted)] text-[10px] font-black uppercase tracking-[0.2em]">Message Flux Over Time</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="hidden md:flex items-center gap-1.5 mr-6">
                         <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_#2563eb]" />
                         <span className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest">Live Feed</span>
                      </div>
                      <select className="bg-white/5 border border-[var(--border-strong)] rounded-xl px-4 py-2.5 text-[10px] font-black text-gray-300 uppercase tracking-widest focus:outline-none hover:bg-white/10 transition-all cursor-pointer">
                         <option>Last 24 Hours</option>
                         <option>Last 7 Days</option>
                         <option>Last 30 Days</option>
                      </select>
                   </div>
                </div>

                <div className="h-[400px] w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_DAILY_STATS}>
                      <defs>
                        <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#4b5563', fontSize: 10, fontWeight: 800}} 
                        dy={15}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#4b5563', fontSize: 10, fontWeight: 800}}
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(12, 12, 14, 0.95)', 
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '24px', 
                          padding: '16px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                        cursor={{stroke: '#3b82f6', strokeWidth: 1}}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#3b82f6" 
                        strokeWidth={5}
                        fillOpacity={1} 
                        fill="url(#colorMsg)" 
                        animationDuration={2500}
                        activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: '#000' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[var(--card)]/40 backdrop-blur-xl border border-[var(--border)] rounded-[40px] p-10 shadow-2xl group hover:border-purple-500/20 transition-all duration-500">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black">User Growth</h3>
                      <Users className="text-purple-500/50" size={20} />
                   </div>
                   <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={MOCK_DAILY_STATS}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10, fontWeight: 700}} />
                            <Bar dataKey="users" fill="#a855f7" radius={[8, 8, 0, 0]} barSize={24} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="bg-[var(--card)]/40 backdrop-blur-xl border border-[var(--border)] rounded-[40px] p-10 shadow-2xl group hover:border-amber-500/20 transition-all duration-500">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black">Conversion</h3>
                      <TrendingUp className="text-amber-500/50" size={20} />
                   </div>
                   <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={MOCK_DAILY_STATS}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                            <Line 
                              type="monotone" 
                              dataKey="conversion" 
                              stroke="#f59e0b" 
                              strokeWidth={4} 
                              dot={{r: 6, fill: '#000', stroke: '#f59e0b', strokeWidth: 2}} 
                              activeDot={{r: 8}}
                            />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          </div>

          {/* Sidebar Insights */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-gradient-to-br from-[var(--primary-light)] to-[var(--accent-light)] border border-[var(--border-strong)] rounded-[48px] p-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[var(--primary-light)] blur-3xl group-hover:bg-[var(--primary-light)] transition-colors duration-1000" />
                <div className="relative z-10">
                   <div className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] mb-8 shadow-inner">
                      <TrendingUp size={28} />
                   </div>
                   <h3 className="text-2xl font-black mb-3">AI Prediction</h3>
                   <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">Neural forecasting predicts a <span className="text-white font-black tracking-tight text-lg">24% spike</span> in engagement levels over the next harvest cycle.</p>
                   
                   <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">Confidence Level</span>
                         <span className="text-[10px] font-black text-white">92%</span>
                      </div>
                      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-[var(--border)]">
                         <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] h-full w-[92%] rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-[var(--card)]/40 backdrop-blur-xl border border-[var(--border)] rounded-[48px] p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-xl font-black">Top Performers</h3>
                   <Bot className="text-[var(--foreground-muted)]" size={20} />
                </div>
                <div className="space-y-8">
                   <AgentRankItem name="Customer Support Bot" messages={1402} percentage={82} color="blue" />
                   <AgentRankItem name="Sales Lead Bot" messages={892} percentage={64} color="purple" />
                   <AgentRankItem name="Tech FAQ Assistant" messages={452} percentage={35} color="emerald" />
                </div>
                <button className="w-full mt-10 py-5 border border-[var(--border)] rounded-[24px] text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all duration-500">
                   Export Intelligence
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isUp, icon, color }) {
  const colorMap = {
    blue: 'text-[var(--primary)] bg-[var(--primary-hover)]/10 border-[var(--primary-light)]',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/10',
  };

  return (
    <div className="bg-[var(--card)]/40 backdrop-blur-xl border border-[var(--border)] rounded-[38px] p-10 shadow-2xl hover:border-white/20 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--input-bg)] rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-white/[0.04] transition-colors" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 border ${colorMap[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tight ${isUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <h4 className="text-[var(--foreground-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">{title}</h4>
      <div className="text-4xl font-black tracking-tighter ml-1">{value}</div>
    </div>
  );
}

function AgentRankItem({ name, messages, percentage, color }) {
   const colorMap = {
      blue: 'bg-[var(--primary)] shadow-[0_0_10px_rgba(37,99,235,0.4)]',
      purple: 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.4)]',
      emerald: 'bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.4)]',
   };

   return (
      <div className="space-y-3">
         <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-300">{name}</span>
            <span className="text-[10px] font-black text-[var(--foreground-muted)] uppercase">{messages} hits</span>
         </div>
         <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-[var(--border)]">
            <div 
               className={`h-full rounded-full transition-all duration-1000 ${colorMap[color]}`} 
               style={{ width: `${percentage}%` }}
            />
         </div>
      </div>
   )
}
