'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Users, 
  Search, 
  Download, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  Loader2,
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Sparkles,
  Database
} from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await api.get('/leads');
      setLeads(data.data || []);
    } catch (err) {
      console.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      setLeads(leads.filter(l => l.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'Captured At', 'Bot UID'];
    const csvContent = [
      headers.join(','),
      ...leads.map(l => [
        `"${l.name}"`,
        `"${l.email}"`,
        `"${l.phone}"`,
        `"${l.created_at}"`,
        `"${l.bot_uid}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            Lead Hub
            <span className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-emerald-500/10">
              {leads.length} Captured
            </span>
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm font-medium">Automatic lead generation from your intelligent chat agents.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={exportToCSV}
             className="flex items-center gap-2 bg-[var(--card)] hover:bg-white/5 border border-[var(--border)] text-[var(--foreground)] px-8 py-4 rounded-2xl transition-all font-bold shadow-xl shadow-black/20"
           >
             <Download size={20} className="text-[var(--primary)]" />
             Export CSV
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="relative flex-1 group">
           <div className="absolute inset-0 bg-[var(--primary-light)] rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={20} />
           <input 
             type="text" 
             placeholder="Search by name, email, or metadata..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-[var(--primary-light)] transition-all text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] relative z-10"
           />
        </div>
        <button className="bg-[var(--card)] border border-[var(--border)] p-5 rounded-2xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
           <Filter size={18} />
           Advanced Filters
        </button>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
           <div className="w-16 h-16 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin" />
           <p className="text-[var(--foreground-muted)] font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">Syncing Database...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-[var(--card)] rounded-[40px] border border-[var(--border)] p-24 text-center">
          <div className="w-24 h-24 bg-[var(--primary-light)] rounded-[32px] border border-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] mx-auto mb-8 shadow-inner shadow-[var(--primary-light)]">
            <Database size={48} className="animate-float" />
          </div>
          <h2 className="text-2xl font-black text-[var(--foreground)] mb-3">Neural Storage Empty</h2>
          <p className="text-[var(--foreground-muted)] max-w-sm mx-auto font-medium mb-10">Deploy your agents on a live site to start capturing high-intent customer leads automatically.</p>
          <button 
            onClick={() => window.location.href = '/dashboard/bots'}
            className="bg-white/5 hover:bg-white/10 text-[var(--foreground)] font-bold px-8 py-4 rounded-2xl transition-all border border-[var(--border)] flex items-center gap-3 mx-auto"
          >
             Set Up Capture Forms <ArrowUpRight size={18} />
          </button>
        </div>
      ) : (
        <div className="bg-[var(--card)] rounded-[40px] border border-[var(--border)] overflow-hidden shadow-2xl relative">
           {/* Decorative corner glow */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-light)] blur-[100px] pointer-events-none" />
           
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--input-bg)] text-[var(--foreground-muted)] text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-10 py-8 border-b border-[var(--border)]">Visitor Profile</th>
                  <th className="px-10 py-8 border-b border-[var(--border)]">Digital Handshake</th>
                  <th className="px-10 py-8 border-b border-[var(--border)]">Capture Event</th>
                  <th className="px-10 py-8 border-b border-[var(--border)]">Source Agent</th>
                  <th className="px-10 py-8 border-b border-[var(--border)] text-right">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-[var(--foreground)]">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.01] transition-all duration-300 group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary-light)] to-[var(--accent-light)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] font-black text-sm group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/20">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                           <span className="font-black text-base block group-hover:text-[var(--primary)] transition-colors">{lead.name}</span>
                           <span className="text-[10px] text-[var(--foreground-subtle)] uppercase tracking-widest font-bold">Verified Identity</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-xs font-bold text-[var(--foreground-muted)]">
                          <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[var(--foreground-subtle)]"><Mail size={12} /></div>
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-[var(--foreground-muted)]">
                          <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[var(--foreground-subtle)]"><Phone size={12} /></div>
                          {lead.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs font-black text-[var(--foreground-muted)] mb-1">
                          <Calendar size={14} className="text-[var(--foreground-subtle)]" />
                          {new Date(lead.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <span className="text-[10px] text-[var(--foreground-subtle)] uppercase font-bold tracking-tighter">
                           {new Date(lead.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1.5 rounded-xl w-fit uppercase tracking-widest border border-emerald-500/10 flex items-center gap-2">
                        <Sparkles size={10} />
                        Agent #{lead.bot_uid.substring(0, 5)}
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-all border border-[var(--border)]">
                          <ExternalLink size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl text-[var(--foreground-subtle)] hover:text-red-500 transition-all border border-[var(--border)]"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer Pagination Mock */}
          <div className="p-8 bg-white/[0.01] border-t border-[var(--border)] flex items-center justify-between">
             <p className="text-xs font-bold text-[var(--foreground-muted)]">Showing <span className="text-[var(--foreground)]">{filteredLeads.length}</span> results in real-time</p>
             <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/5 border border-[var(--border)] text-[var(--foreground-subtle)] cursor-not-allowed"><ChevronRight size={16} className="rotate-180" /></button>
                <div className="flex items-center gap-1 px-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                   <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                   <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                </div>
                <button className="p-2 rounded-lg bg-white/5 border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"><ChevronRight size={16} /></button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
