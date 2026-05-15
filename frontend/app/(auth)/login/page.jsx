'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import { Bot, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

function LoginContent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const err = searchParams.get('error');

    if (token) {
      Cookies.set('auth_token', token, { expires: 7 });
      router.push('/dashboard');
    }

    if (err) {
      setError('Google login failed. Please try again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/auth/login', formData);
      Cookies.set('auth_token', data.token, { expires: 7 });
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data } = await api.get('/auth/google');
      window.location.href = data.url;
    } catch (err) {
      setError('Failed to initialize Google login');
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-[var(--foreground)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary-light)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--sidebar-active-shadow)]">
              <Bot className="text-[var(--foreground)]" size={28} />
            </div>
            <span className="text-2xl font-bold tracking-tight">AntigravityAI</span>
          </Link>
          <h1 className="text-3xl font-black mb-2 text-center">Welcome back</h1>
          <p className="text-[var(--foreground-muted)] text-sm text-center">Log in to manage your AI workforce.</p>
        </div>

        {/* Form Card */}
        <div className="bg-[var(--card)] p-8 rounded-[40px] border border-[var(--border)] shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-[var(--border-strong)] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all placeholder:text-[var(--foreground-subtle)]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest hover:text-[var(--primary)]">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-[var(--border-strong)] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all placeholder:text-[var(--foreground-subtle)]"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-bold py-4 rounded-2xl shadow-xl shadow-[var(--sidebar-active-shadow)] transition-all flex items-center justify-center gap-2 group mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-[var(--card)] px-4 text-[var(--foreground-muted)]">Or continue with</span></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white/[0.03] hover:bg-white/[0.08] border border-[var(--border-strong)] text-[var(--foreground)] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 group"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Continue with Google
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col items-center gap-4">
             <p className="text-sm text-[var(--foreground-muted)]">
               New to Antigravity AI?{' '}
               <Link href="/register" className="text-[var(--foreground)] font-bold hover:text-[var(--primary)] transition-colors">
                 Create Account
               </Link>
             </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-10 text-center text-[10px] text-[var(--foreground-subtle)] uppercase tracking-widest font-medium">
          Protected by enterprise-grade <br />
          <span className="text-[var(--foreground-muted)]">Bank-level encryption</span>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050506] flex items-center justify-center"><Loader2 className="animate-spin text-[var(--primary)]" size={40} /></div>}>
      <LoginContent />
    </Suspense>
  );
}
