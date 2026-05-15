'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  LayoutDashboard, 
  Bot, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Users,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    fetchUser();
    // Read saved theme
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (err) {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    Cookies.remove('auth_token');
    router.push('/login');
  };

  const navItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'My Agents', icon: <Bot size={20} />, path: '/dashboard/bots' },
    { name: 'Conversations', icon: <MessageSquare size={20} />, path: '/dashboard/conversations' },
    { name: 'Leads', icon: <Users size={20} />, path: '/dashboard/leads' },
    { name: 'Training', icon: <BookOpen size={20} />, path: '/dashboard/training' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  if (user?.is_admin) {
    navItems.push({ name: 'Super Admin', icon: <ShieldCheck size={20} />, path: '/dashboard/admin' });
  }

  const SidebarContent = () => (
    <>
      {/* Logo Area */}
      <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.svg" 
            alt="Samskriti Solutions" 
            width={140} 
            height={40} 
            className="h-9 w-auto"
            style={{ filter: theme === 'dark' ? 'brightness(1.6) saturate(1.2)' : 'none' }}
          />
        </div>
        {isMobileOpen && (
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="p-2 rounded-lg lg:hidden transition-colors"
            style={{ color: 'var(--foreground-muted)' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 mt-6">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative"
              style={{
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--foreground-muted)',
                boxShadow: isActive ? '0 4px 16px var(--sidebar-active-shadow)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--primary-light)';
                  e.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--foreground-muted)';
                }
              }}
            >
              <div>{item.icon}</div>
              {(isSidebarOpen || isMobileOpen) && (
                <span className="font-semibold text-sm flex-1">{item.name}</span>
              )}
              {isActive && (isSidebarOpen || isMobileOpen) && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Theme Toggle + Logout */}
      <div className="p-4 mt-auto space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
        {/* Theme Toggle */}
        {(isSidebarOpen || isMobileOpen) && (
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium"
            style={{ color: 'var(--foreground-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            <div className="ml-auto">
              <button className="theme-toggle" aria-label="Toggle theme" />
            </div>
          </button>
        )}

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm"
          style={{ color: 'var(--danger)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={20} />
          {(isSidebarOpen || isMobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col fixed h-full z-30 transition-all duration-300 ${
          isSidebarOpen ? 'w-72' : 'w-20'
        }`}
        style={{ 
          background: 'var(--sidebar-bg)', 
          borderRight: '1px solid var(--border)' 
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside 
        className={`lg:hidden fixed inset-y-0 left-0 w-72 z-50 transition-transform duration-300 transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          background: 'var(--sidebar-bg)', 
          borderRight: '1px solid var(--border)' 
        }}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 min-w-0 ${
          isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
        }`}
      >
        {/* Header */}
        <header 
          className="h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20"
          style={{ 
            background: 'var(--header-bg)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)' 
          }}
        >
          <div className="flex items-center gap-4">
            {/* Desktop Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block p-2 rounded-lg transition-all"
              style={{ color: 'var(--foreground-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-lg lg:hidden transition-all"
              style={{ color: 'var(--foreground-muted)' }}
            >
              <Menu size={20} />
            </button>

            <span className="font-bold lg:hidden" style={{ color: 'var(--foreground)' }}>
              Samskriti
            </span>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            {/* Desktop theme toggle (compact) */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex p-2 rounded-lg transition-all"
              style={{ color: 'var(--foreground-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none mb-1" style={{ color: 'var(--foreground)' }}>
                {user?.name || 'Account'}
              </p>
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--foreground-subtle)' }}>
                {user?.plan ? `${user.plan} Plan` : 'Free Plan'}
              </p>
            </div>
            
            {/* Avatar */}
            <div 
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-full p-0.5"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              <div 
                className="w-full h-full rounded-full flex items-center justify-center font-black text-[10px] uppercase tracking-tighter"
                style={{ background: 'var(--background)', color: 'var(--foreground)' }}
              >
                {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'SS'}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-full lg:max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
