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
            <Sparkles className="text-[var(--primary)]" size={24} />
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm font-medium">Manage your digital identity and account configurations.</p>
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
          
          <div className="mt-10 p-6 rounded-3xl bg-[var(--primary-light)] border border-[var(--primary-light)]">
             <div className="flex items-center gap-2 text-[var(--primary)] mb-2">
                <Zap size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Support</span>
             </div>
             <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed font-medium">Need assistance? Our engineering team is here to help 24/7.</p>
             <button className="mt-4 text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest hover:text-[var(--primary)] transition-colors">Open Ticket</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative corner glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-light)] blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            {activeTab === 'profile' && (
              <div className="space-y-10 animate-fade-in">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-[var(--border)]">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-0.5 shadow-2xl">
                      <div className="w-full h-full rounded-[22px] bg-[var(--card)] flex items-center justify-center font-black text-3xl uppercase tracking-tighter">
                        {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-[22px] object-cover" /> : user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'AI'}
                      </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                       <Camera size={18} />
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-black mb-1">Account Identity</h3>
                    <p className="text-sm text-[var(--foreground-muted)] font-medium mb-4">Your avatar is displayed across the platform and in chat takeovers.</p>
                    <div className="flex gap-4 justify-center sm:justify-start">
                       <button className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] hover:text-[var(--primary)] transition-colors">Upload New</button>
                       <button className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest ml-1">Full Identity Name</label>
                    <div className="relative group">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:border-[var(--primary-light)] transition-all"
                       />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest ml-1">Primary Email Node</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                       <input 
                         type="email" 
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:border-[var(--primary-light)] transition-all"
                       />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest ml-1">Organization Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Brief description of your business or project..."
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[var(--primary-light)] transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10 animate-fade-in">
                <div className="p-6 bg-[var(--primary-light)] border border-[var(--primary-light)] rounded-3xl flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)]">
                     <Shield size={24} />
                  </div>
                  <div>
                     <h4 className="font-black text-sm mb-1">Security Shield Active</h4>
                     <p className="text-xs text-[var(--foreground-muted)] font-medium">Protect your workspace with advanced encryption and 2FA.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest ml-1">Current Cipher</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-2xl py-4 pl-6 pr-14 text-sm font-bold focus:outline-none focus:border-[var(--primary-light)] transition-all"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest ml-1">New Neural Cipher</label>
                      <input 
                        type="password"
                        placeholder="New password"
                        className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[var(--primary-light)] transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest ml-1">Confirm New Cipher</label>
                      <input 
                        type="password"
                        placeholder="Repeat new password"
                        className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[var(--primary-light)] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--border)]">
                   <div className="flex items-center justify-between p-6 rounded-[32px] bg-[var(--input-bg)] border border-[var(--border)]">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-500">
                            <Zap size={20} />
                         </div>
                         <div>
                            <p className="text-sm font-black">Two-Factor Authentication</p>
                            <p className="text-[10px] text-[var(--foreground-subtle)] font-bold uppercase tracking-widest">Highly Recommended</p>
                         </div>
                      </div>
                      <button className="bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-[var(--border)] transition-all">Configure</button>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-10 animate-fade-in text-center py-12">
                 <div className="w-24 h-24 bg-[var(--primary-light)] rounded-[32px] border border-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] mx-auto mb-8 shadow-inner shadow-[var(--primary-light)]">
                   <CreditCard size={48} className="animate-float" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black mb-3">Enterprise Pro Active</h3>
                    <p className="text-[var(--foreground-muted)] text-sm max-w-sm mx-auto font-medium leading-relaxed">You are currently on the professional tier. Enjoy unlimited agents and enhanced training capabilities.</p>
                 </div>
                 
                 <div className="max-w-md mx-auto grid grid-cols-2 gap-4 pt-4">
                    <div className="p-6 rounded-[32px] bg-[var(--input-bg)] border border-[var(--border)] text-left">
                       <span className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest block mb-2">Next Invoice</span>
                       <span className="text-lg font-black text-[var(--foreground)]">$29.00</span>
                    </div>
                    <div className="p-6 rounded-[32px] bg-[var(--input-bg)] border border-[var(--border)] text-left">
                       <span className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest block mb-2">Due Date</span>
                       <span className="text-lg font-black text-[var(--foreground)]">June 1, 2026</span>
                    </div>
                 </div>

                 <button className="mt-8 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-[var(--sidebar-active-shadow)]">Manage Subscription</button>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                 <Clock size={16} className="text-[var(--foreground-subtle)]" />
                 <p className="text-[10px] text-[var(--foreground-subtle)] font-bold uppercase tracking-[0.2em]">Neural config synced: Just now</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={saved}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 rounded-2xl font-black text-sm transition-all shadow-2xl ${saved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-[var(--sidebar-active-shadow)]'}`}
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
      className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${active ? 'bg-[var(--primary)] text-white shadow-2xl shadow-[var(--sidebar-active-shadow)] border border-[var(--primary)]' : 'text-[var(--foreground-muted)] hover:bg-[var(--card)] hover:text-[var(--foreground)] border border-transparent'}`}
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
