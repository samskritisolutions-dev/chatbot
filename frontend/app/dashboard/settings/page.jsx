'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  LogOut,
  Camera,
  ChevronRight,
  Clock
} from 'lucide-react';
import Cookies from 'js-cookie';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          bio: data.bio || ''
        });
      } catch (err) {
        console.error('Failed to fetch user');
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/auth/profile', { 
        name: formData.name, 
        email: formData.email 
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  const handleLogout = () => {
    Cookies.remove('auth_token');
    window.location.href = '/login';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            Settings
            <Sparkles className="text-blue-500" size={24} />
          </h1>
          <p className="text-gray-500 text-sm font-medium">Manage your digital identity and account configurations.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest border border-red-500/10"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 space-y-3">
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={<User size={18} />} 
            label="Profile Identity" 
          />
          <TabButton 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')} 
            icon={<Shield size={18} />} 
            label="Security & Privacy" 
          />
          <TabButton 
            active={activeTab === 'billing'} 
            onClick={() => setActiveTab('billing')} 
            icon={<CreditCard size={18} />} 
            label="Billing & Plans" 
          />
          <TabButton 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
            icon={<Bell size={18} />} 
            label="Global Alerts" 
          />
          
          <div className="mt-10 p-6 rounded-3xl bg-blue-600/5 border border-blue-500/10">
             <div className="flex items-center gap-2 text-blue-500 mb-2">
                <Zap size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Support</span>
             </div>
             <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Need assistance? Our engineering team is here to help 24/7.</p>
             <button className="mt-4 text-[10px] font-black text-white uppercase tracking-widest hover:text-blue-400 transition-colors">Open Ticket</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#0c0c0e] border border-white/5 rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative corner glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            {activeTab === 'profile' && (
              <div className="space-y-10 animate-fade-in">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-white/5">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-2xl">
                      <div className="w-full h-full rounded-[22px] bg-[#0c0c0e] flex items-center justify-center font-black text-3xl uppercase tracking-tighter">
                        {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-[22px] object-cover" /> : user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'AI'}
                      </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                       <Camera size={18} />
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-black mb-1">Account Identity</h3>
                    <p className="text-sm text-gray-500 font-medium mb-4">Your avatar is displayed across the platform and in chat takeovers.</p>
                    <div className="flex gap-4 justify-center sm:justify-start">
                       <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">Upload New</button>
                       <button className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-gray-400 transition-colors">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Full Identity Name</label>
                    <div className="relative group">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                       />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Primary Email Node</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                       <input 
                         type="email" 
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                       />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Organization Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Brief description of your business or project..."
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10 animate-fade-in">
                <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-3xl flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                     <Shield size={24} />
                  </div>
                  <div>
                     <h4 className="font-black text-sm mb-1">Security Shield Active</h4>
                     <p className="text-xs text-gray-500 font-medium">Protect your workspace with advanced encryption and 2FA.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Current Cipher</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">New Neural Cipher</label>
                      <input 
                        type="password"
                        placeholder="New password"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Confirm New Cipher</label>
                      <input 
                        type="password"
                        placeholder="Repeat new password"
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <div className="flex items-center justify-between p-6 rounded-[32px] bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-500">
                            <Zap size={20} />
                         </div>
                         <div>
                            <p className="text-sm font-black">Two-Factor Authentication</p>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Highly Recommended</p>
                         </div>
                      </div>
                      <button className="bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/5 transition-all">Configure</button>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-10 animate-fade-in text-center py-12">
                 <div className="w-24 h-24 bg-blue-600/5 rounded-[32px] border border-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-8 shadow-inner shadow-blue-500/5">
                   <CreditCard size={48} className="animate-float" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black mb-3">Enterprise Pro Active</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium leading-relaxed">You are currently on the professional tier. Enjoy unlimited agents and enhanced training capabilities.</p>
                 </div>
                 
                 <div className="max-w-md mx-auto grid grid-cols-2 gap-4 pt-4">
                    <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 text-left">
                       <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Next Invoice</span>
                       <span className="text-lg font-black text-white">$29.00</span>
                    </div>
                    <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 text-left">
                       <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Due Date</span>
                       <span className="text-lg font-black text-white">June 1, 2026</span>
                    </div>
                 </div>

                 <button className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-600/20">Manage Subscription</button>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                 <Clock size={16} className="text-gray-700" />
                 <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Neural config synced: Just now</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={saved}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 rounded-2xl font-black text-sm transition-all shadow-2xl ${saved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'}`}
              >
                {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
                {saved ? 'Matrix Updated' : 'Push Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20 border border-blue-500' : 'text-gray-500 hover:bg-[#0c0c0e] hover:text-white border border-transparent'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </div>
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      {active && <ChevronRight size={16} className="opacity-60" />}
    </button>
  );
}
