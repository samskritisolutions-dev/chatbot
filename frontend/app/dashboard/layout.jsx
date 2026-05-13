'use client';
import Link from 'next/link';
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
  Sparkles,
  Menu,
  X,
  Users,
  ShieldCheck
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

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
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          {(isSidebarOpen || isMobileOpen) && (
            <span className="font-bold text-xl tracking-tight">Antigravity</span>
          )}
        </div>
        {isMobileOpen && (
          <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-white/5 rounded-lg lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                {item.icon}
              </div>
              {(isSidebarOpen || isMobileOpen) && (
                <span className="font-medium text-sm flex-1">{item.name}</span>
              )}
              {isActive && (isSidebarOpen || isMobileOpen) && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-400/5 rounded-xl transition-all font-medium text-sm"
        >
          <LogOut size={20} />
          {(isSidebarOpen || isMobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col border-r border-white/5 bg-[#09090b] transition-all duration-300 fixed h-full z-30 ${
          isSidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <aside 
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-[#09090b] border-r border-white/5 z-50 transition-transform duration-300 transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
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
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 bg-[#09090b]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            {/* Desktop Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:p-2 lg:hover:bg-white/5 lg:rounded-lg lg:transition-all lg:block"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 hover:bg-white/5 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>

            <span className="font-bold lg:hidden">Antigravity</span>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none mb-1">{user?.name || 'Account'}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                {user?.plan ? `${user.plan} Plan` : 'Standard'}
              </p>
            </div>
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border border-white/10 p-0.5">
              <div className="w-full h-full rounded-full bg-[#09090b] flex items-center justify-center font-black text-[10px] uppercase tracking-tighter">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'AI'}
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
