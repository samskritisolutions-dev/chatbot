import Link from 'next/link';
import { 
  ArrowRight, 
  Bot, 
  Sparkles, 
  Zap, 
  Shield, 
  MessageSquare, 
  BrainCircuit, 
  Globe, 
  Code2, 
  Check,
  CheckCircle2,
  ChevronRight,
  Monitor,
  LineChart
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050506] text-[var(--foreground)] selection:bg-[var(--primary)]/30 selection:text-[var(--foreground)]">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary-light)] rounded-full blur-[140px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] opacity-50" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[var(--primary-light)] rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--sidebar-active-shadow)]">
              <Bot className="text-[var(--foreground)]" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Antigravity<span className="text-[var(--primary)]">AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Pricing</Link>
            <Link href="#docs" className="text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Docs</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Sign In</Link>
            <Link href="/register" className="px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] text-sm font-bold rounded-xl transition-all shadow-lg shadow-[var(--sidebar-active-shadow)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32">
        {/* Hero Section */}
        <section className="px-6 pb-24 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-light)] border border-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold uppercase tracking-widest mb-8 animate-fade-in shadow-xl shadow-[var(--primary-light)]">
            <Sparkles size={14} />
            <span>Next-Gen GPT-4o Integration</span>
          </div>
          
          <h1 className="text-6xl md:text-[90px] font-black leading-[1.05] tracking-tight mb-8 animate-fade-in [text-wrap:balance]">
            Empower your site with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--gold)]">Autonomous AI</span>
          </h1>
          
          <p className="text-[var(--foreground-muted)] text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in opacity-90">
            Build, train, and deploy intelligent custom chatbots in under 60 seconds. Trained on your data, loyal to your brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group shadow-2xl">
              Start Building Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-[var(--border-strong)] text-[var(--foreground)] font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Explore Plans
            </Link>
          </div>

          {/* Hero Preview */}
          <div className="mt-24 relative p-4 bg-white/5 rounded-[40px] border border-[var(--border-strong)] shadow-2xl animate-fade-in">
            <div className="bg-[var(--card)] rounded-[32px] overflow-hidden border border-[var(--border)] aspect-video flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-[var(--foreground-muted)]">
                <div className="w-20 h-20 bg-[var(--primary-light)] rounded-full flex items-center justify-center animate-pulse">
                   <Monitor size={40} className="text-[var(--primary)]" />
                </div>
                <p className="font-mono text-sm uppercase tracking-widest">Platform Preview Interface</p>
              </div>
            </div>
            {/* Floating Decorative Elements */}
            <div className="absolute -top-12 -left-12 p-6 bg-[var(--primary-light)] backdrop-blur-2xl rounded-3xl border border-[var(--border-strong)] hidden lg:block animate-float">
               <BrainCircuit className="text-[var(--primary)]" size={32} />
            </div>
            <div className="absolute -bottom-12 -right-12 p-6 bg-purple-600/20 backdrop-blur-2xl rounded-3xl border border-[var(--border-strong)] hidden lg:block animate-float-delayed">
               <MessageSquare className="text-purple-400" size={32} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-32 bg-[#080809]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Built for Modern Businesses</h2>
              <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto">Everything you need to automate your customer support and lead generation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<BrainCircuit size={28} className="text-[var(--primary)]" />}
                title="Knowledge Ingestion"
                description="Upload PDFs, link your website, or paste text. Our AI learns your business logic instantly."
              />
              <FeatureCard 
                icon={<Globe size={28} className="text-purple-400" />}
                title="Global Deployment"
                description="Embed your bot on any platform with a single script tag. Support for WordPress, Shopify, and more."
              />
              <FeatureCard 
                icon={<Zap size={28} className="text-amber-400" />}
                title="Real-time Takeover"
                description="Seamlessly jump into any conversation when the AI needs human assistance."
              />
              <FeatureCard 
                icon={<Shield size={28} className="text-emerald-400" />}
                title="Data Privacy"
                description="GDPR compliant. Your training data is encrypted and never shared with other clients."
              />
              <FeatureCard 
                icon={<Code2 size={28} className="text-rose-400" />}
                title="Deep Customization"
                description="Customize colors, themes, and bot personality to match your brand perfectly."
              />
              <FeatureCard 
                icon={<LineChart size={28} className="text-cyan-400" />}
                title="Advanced Analytics"
                description="Track bot performance, conversion rates, and popular customer queries in real-time."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Simple, Scalable Pricing</h2>
              <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto">Choose the plan that fits your growth stage.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PricingCard 
                name="Starter"
                price="0"
                description="Perfect for individuals and small side projects."
                features={["1 AI Chatbot", "100 Messages / month", "Standard Knowledge Base", "Web Widget Only"]}
                buttonText="Get Started Free"
              />
              <PricingCard 
                name="Pro"
                price="29"
                highlighted
                description="For growing businesses that need more power."
                features={["5 AI Chatbots", "5,000 Messages / month", "Unlimited Knowledge Sources", "Live Agent Takeover", "Custom Branding", "Priority Support"]}
                buttonText="Start Free Trial"
              />
              <PricingCard 
                name="Enterprise"
                price="Custom"
                description="Maximum performance and dedicated infrastructure."
                features={["Unlimited Chatbots", "Unlimited Messages", "Custom AI Fine-tuning", "Dedicated Support Manager", "White-label API Access", "SLA Guarantee"]}
                buttonText="Contact Sales"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-32">
          <div className="max-w-5xl mx-auto p-12 lg:p-20 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-[40px] text-center relative overflow-hidden shadow-2xl shadow-[var(--sidebar-active-shadow)]">
             <div className="relative z-10">
               <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to Automate <br /> Your Business?</h2>
               <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl">
                 Create Your Bot Now
                 <ChevronRight size={20} />
               </Link>
             </div>
             {/* Decorative Background for CTA */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </section>
      </main>

      <footer className="px-6 py-20 border-t border-[var(--border)] bg-[#080809]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center shadow-lg">
                <Bot className="text-[var(--foreground)]" size={20} />
              </div>
              <span className="text-lg font-bold">Antigravity AI</span>
            </div>
            <p className="text-[var(--foreground-muted)] text-sm max-w-xs text-center md:text-left">
              The world's most intuitive AI support platform for modern digital businesses.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm text-[var(--foreground-muted)]">
             <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy</Link>
             <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</Link>
             <Link href="#" className="hover:text-[var(--foreground)] transition-colors">Contact</Link>
          </div>

          <div className="text-[var(--foreground-muted)] text-sm">
            &copy; {new Date().getFullYear()} Antigravity AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-white/[0.04] transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, description, features, buttonText, highlighted = false }) {
  return (
    <div className={`p-10 rounded-[40px] border flex flex-col transition-all hover:scale-[1.02] ${highlighted ? 'bg-[var(--primary)] border-[var(--primary)] shadow-2xl shadow-[var(--sidebar-active-shadow)] text-[var(--foreground)]' : 'bg-white/[0.02] border-[var(--border)] text-[var(--foreground-muted)]'}`}>
      <div className="mb-10">
        <h3 className={`text-lg font-black uppercase tracking-widest mb-4 ${highlighted ? 'text-[var(--foreground)]' : 'text-[var(--primary)]'}`}>{name}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-black tracking-tight">{price !== 'Custom' && '$'}{price}</span>
          {price !== 'Custom' && <span className="text-sm opacity-60">/ month</span>}
        </div>
        <p className={`text-sm leading-relaxed ${highlighted ? 'text-white/80' : 'text-[var(--foreground-muted)]'}`}>{description}</p>
      </div>

      <div className="space-y-4 mb-10 flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 text-sm font-medium">
            <CheckCircle2 size={18} className={highlighted ? 'text-[var(--foreground)]' : 'text-[var(--primary)]'} />
            <span className={highlighted ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}>{f}</span>
          </div>
        ))}
      </div>

      <Link 
        href="/register" 
        className={`w-full py-4 rounded-2xl font-black text-center transition-all ${highlighted ? 'bg-white text-[var(--primary)] hover:bg-gray-100' : 'bg-white/5 hover:bg-white/10 text-[var(--foreground)]'}`}
      >
        {buttonText}
      </Link>
    </div>
  );
}
