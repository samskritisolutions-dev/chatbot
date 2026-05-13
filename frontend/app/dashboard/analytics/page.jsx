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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            Performance Insights
            <Activity className="text-blue-500" size={24} />
          </h1>
          <p className="text-gray-500 text-sm font-medium">Real-time analytics for your intelligent bot workforce.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-[#0c0c0e] border border-white/5 text-gray-400 font-bold px-5 py-3 rounded-2xl flex items-center gap-2 hover:text-white transition-all">
              <Filter size={16} />
              Filter
           </button>
           <button className="bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl shadow-blue-600/20">
              <Calendar size={16} />
              Last 7 Days
           </button>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Messages" 
          value={stats?.total_messages || '0'} 
          trend="+12.4%" 
          isUp={true} 
          icon={<MessageSquare size={20} />} 
          color="blue"
        />
        <StatCard 
          title="Active Users" 
          value={stats?.total_users || '0'} 
          trend="+5.2%" 
          isUp={true} 
          icon={<Users size={20} />} 
          color="purple"
        />
        <StatCard 
          title="Response Time" 
          value={stats?.avg_response_time || '0s'} 
          trend="-0.2s" 
          isUp={true} 
          icon={<Clock size={20} />} 
          color="emerald"
        />
        <StatCard 
          title="Conversion Rate" 
          value={stats?.conversion_rate || '0%'} 
          trend="-1.4%" 
          isUp={false} 
          icon={<TrendingUp size={20} />} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-[#0c0c0e] border border-white/5 rounded-[40px] p-8 lg:p-10 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-xl font-black mb-1">Message Volume</h3>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">Weekly Activity Overview</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-4">
                       <div className="w-2 h-2 rounded-full bg-blue-600" />
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inbound</span>
                    </div>
                    <select className="bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest focus:outline-none">
                       <option>Daily</option>
                       <option>Hourly</option>
                    </select>
                 </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_DAILY_STATS}>
                    <defs>
                      <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6b7280', fontSize: 11, fontWeight: 700}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6b7280', fontSize: 11, fontWeight: 700}}
                    />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#161618', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#fff'}}
                      itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#2563eb" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorMsg)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0c0c0e] border border-white/5 rounded-[40px] p-8 shadow-2xl">
                 <h3 className="text-lg font-black mb-6">User Acquisition</h3>
                 <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={MOCK_DAILY_STATS}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                          <Bar dataKey="users" fill="#9333ea" radius={[6, 6, 0, 0]} barSize={20} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="bg-[#0c0c0e] border border-white/5 rounded-[40px] p-8 shadow-2xl">
                 <h3 className="text-lg font-black mb-6">Conversion Impact</h3>
                 <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={MOCK_DAILY_STATS}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                          <Line type="stepAfter" dataKey="conversion" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b'}} />
                       </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/10 rounded-[40px] p-8 relative overflow-hidden">
              <div className="relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 mb-6">
                    <TrendingUp size={24} />
                 </div>
                 <h3 className="text-xl font-black mb-2">Growth Vector</h3>
                 <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6">Based on your current trajectory, message volume will increase by <span className="text-white font-bold">24%</span> next week.</p>
                 <div className="h-2 w-full bg-white/5 rounded-full mb-2">
                    <div className="bg-blue-600 h-full w-[74%] rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                 </div>
                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Efficiency optimized</span>
              </div>
           </div>

           <div className="bg-[#0c0c0e] border border-white/5 rounded-[40px] p-8 shadow-2xl">
              <h3 className="text-lg font-black mb-6">Agent Performance</h3>
              <div className="space-y-6">
                 <AgentRankItem name="Customer Support Bot" messages={1402} percentage={82} />
                 <AgentRankItem name="Sales Lead Bot" messages={892} percentage={64} />
                 <AgentRankItem name="Tech FAQ Assistant" messages={452} percentage={35} />
              </div>
              <button className="w-full mt-8 py-4 border border-white/5 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-white/5 transition-all">
                 View Detailed Report
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isUp, icon, color }) {
  const colorMap = {
    blue: 'text-blue-500 bg-blue-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    amber: 'text-amber-500 bg-amber-500/10',
  };

  return (
    <div className="bg-[#0c0c0e] border border-white/5 rounded-[32px] p-8 shadow-2xl hover:border-white/10 transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${colorMap[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-black tracking-tighter ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
      <div className="text-3xl font-black tracking-tight">{value}</div>
    </div>
  );
}

function AgentRankItem({ name, messages, percentage }) {
   return (
      <div className="space-y-2">
         <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300">{name}</span>
            <span className="text-[10px] font-black text-gray-500">{messages} msg</span>
         </div>
         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
               className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
               style={{ width: `${percentage}%` }}
            />
         </div>
      </div>
   )
}
