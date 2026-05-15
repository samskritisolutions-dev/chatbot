'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { 
  FileText, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  Upload,
  Globe,
  Database,
  Type,
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
  Bot
} from 'lucide-react';

function TrainingContent() {
  const searchParams = useSearchParams();
  const botIdFromUrl = searchParams.get('bot');

  const [activeTab, setActiveTab] = useState('files');
  const [sources, setSources] = useState([]);
  const [bots, setBots] = useState([]);
  const [selectedBotId, setSelectedBotId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [url, setUrl] = useState('');
  const [manualText, setManualText] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [isSavingText, setIsSavingText] = useState(false);

  const fetchBots = async () => {
    try {
      const { data } = await api.get('/bots');
      const botList = Array.isArray(data) ? data : (data.data || []);
      setBots(botList);
      
      if (botIdFromUrl) {
        setSelectedBotId(botIdFromUrl);
      } else if (botList.length > 0) {
        setSelectedBotId(botList[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch bots');
    }
  };

  const fetchSources = async () => {
    try {
      const { data } = await api.get('/training');
      setSources(data || []);
    } catch (err) {
      console.error('Failed to fetch sources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
    fetchSources();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const uploadFile = async (file) => {
    if (!selectedBotId) {
      alert('Please select an agent first');
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    // Find the bot_uid for the selected bot ID
    const bot = bots.find(b => b.id.toString() === selectedBotId.toString());
    if (!bot) return;
    formData.append('bot_uid', bot.bot_uid);

    try {
      await api.post('/training/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchSources();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || 'Check your console'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlImport = async () => {
    if (!selectedBotId) {
      alert('Please select an agent first');
      return;
    }
    if (!url) return;
    
    setIsCrawling(true);
    const bot = bots.find(b => b.id.toString() === selectedBotId.toString());
    
    try {
      await api.post('/training/url', {
        bot_uid: bot.bot_uid,
        url: url
      });
      setUrl('');
      fetchSources();
    } catch (err) {
      alert('Crawling failed: ' + (err.response?.data?.error || 'Check your console'));
    } finally {
      setIsCrawling(false);
    }
  };

  const handleManualTextSave = async () => {
    if (!selectedBotId) {
       alert('Please select an agent first');
       return;
    }
    if (!manualText.trim()) return;

    setIsSavingText(true);
    const bot = bots.find(b => b.id.toString() === selectedBotId.toString());

    try {
      await api.post('/training/text', {
        bot_uid: bot.bot_uid,
        name: 'Manual Text Snippet',
        content: manualText
      });
      setManualText('');
      fetchSources();
    } catch (err) {
      alert('Failed to save text');
    } finally {
      setIsSavingText(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this source?')) return;
    try {
      await api.delete(`/training/${id}`);
      fetchSources();
    } catch (err) {
      console.error('Failed to delete source');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            Training Center
            <Sparkles className="text-[var(--primary)]" size={24} />
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm font-medium">Engineer your bot's intelligence with custom knowledge sources.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[var(--card)] p-2 rounded-2xl border border-[var(--border)] shadow-xl">
           <div className="px-4 py-2 flex flex-col">
              <span className="text-[10px] font-black text-[var(--foreground-subtle)] uppercase tracking-widest leading-none mb-1">Knowledge Capacity</span>
              <div className="flex items-center gap-2">
                 <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--primary)] h-full w-[12%] rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                 </div>
                 <span className="text-xs font-bold">12%</span>
              </div>
           </div>
           <div className="w-px h-8 bg-white/5" />
           <div className="px-4 py-2 flex flex-col">
              <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest leading-none mb-1">System Status</span>
              <span className="text-xs font-bold flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 Operational
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Configuration */}
        <div className="lg:col-span-4 space-y-6">
          {/* Agent Selection Card */}
          <div className="bg-[var(--card)] p-8 rounded-[32px] border border-[var(--border)] shadow-2xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-light)] blur-3xl -mr-16 -mt-16 group-hover:bg-[var(--primary-light)] transition-colors" />
            
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Target AI Agent</label>
                <div className="relative">
                  <Bot className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--primary)]" size={18} />
                  <select 
                    value={selectedBotId}
                    onChange={(e) => setSelectedBotId(e.target.value)}
                    className="w-full bg-[var(--card-hover)] text-[var(--foreground)] border border-[var(--border-strong)] rounded-2xl py-4 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 appearance-none font-bold"
                  >
                    {bots.length === 0 ? (
                      <option value="">No Agents Available</option>
                    ) : (
                      bots.map(bot => (
                        <option key={bot.id} value={bot.id}>
                          {bot.bot_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-widest ml-1">Knowledge Mode</label>
                 <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => setActiveTab('files')}
                      className={`flex items-center gap-3 p-4 rounded-2xl transition-all border ${activeTab === 'files' ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xl shadow-[var(--sidebar-active-shadow)]' : 'bg-[var(--input-bg)] text-[var(--foreground-muted)] border-[var(--border)] hover:bg-white/5'}`}
                    >
                      <Upload size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Documents</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('urls')}
                      className={`flex items-center gap-3 p-4 rounded-2xl transition-all border ${activeTab === 'urls' ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xl shadow-[var(--sidebar-active-shadow)]' : 'bg-[var(--input-bg)] text-[var(--foreground-muted)] border-[var(--border)] hover:bg-white/5'}`}
                    >
                      <Globe size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Website Crawler</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('text')}
                      className={`flex items-center gap-3 p-4 rounded-2xl transition-all border ${activeTab === 'text' ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xl shadow-[var(--sidebar-active-shadow)]' : 'bg-[var(--input-bg)] text-[var(--foreground-muted)] border-[var(--border)] hover:bg-white/5'}`}
                    >
                      <Type size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Direct Input</span>
                    </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
             <div className="relative z-10">
                <BookOpen className="text-white/40 mb-4" size={32} />
                <h3 className="text-xl font-black text-white mb-2">Neural Indexing</h3>
                <p className="text-white/80 text-xs font-medium leading-relaxed mb-6">Your data is converted into high-dimensional vector embeddings for instant retrieval.</p>
                <div className="px-4 py-2 bg-black/20 rounded-xl inline-block text-[10px] font-black text-white uppercase tracking-widest">
                   Enhanced LLM Ready
                </div>
             </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[40px] p-8 lg:p-12 shadow-2xl min-h-[500px] relative overflow-hidden">
            
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="relative z-10">
              {activeTab === 'files' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-10">
                     <h2 className="text-2xl font-black mb-2">Upload Knowledge</h2>
                     <p className="text-[var(--foreground-muted)] text-sm">PDF, DOCX, or TXT documents supported up to 50MB.</p>
                  </div>
                  
                  <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-[40px] p-16 text-center transition-all cursor-pointer group ${
                      dragActive ? 'border-[var(--primary)] bg-[var(--primary-light)] scale-[0.99]' : 'border-[var(--border)] hover:border-[var(--primary-light)] hover:bg-[var(--primary-hover)]/[0.02]'
                    }`}
                  >
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-[40px]">
                        <Loader2 className="animate-spin text-[var(--primary)] mb-4" size={48} />
                        <p className="text-sm font-black uppercase tracking-widest">Processing Intelligence...</p>
                      </div>
                    )}
                    <div className="w-20 h-20 bg-[var(--primary-light)] rounded-[28px] flex items-center justify-center text-[var(--primary)] mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 border border-[var(--primary-light)]">
                      <Upload size={36} />
                    </div>
                    <h4 className="text-xl font-black mb-4">Drag & drop files here</h4>
                    <p className="text-sm text-[var(--foreground-subtle)] mb-10 max-w-xs mx-auto font-medium">Or select files from your computer to begin indexing.</p>
                    
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      multiple
                      onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0])}
                    />
                    <label 
                      htmlFor="file-upload"
                      className="bg-[var(--primary)] text-white px-12 py-4 rounded-2xl font-black text-sm hover:bg-[var(--primary-hover)] transition-all inline-block cursor-pointer shadow-xl shadow-[var(--sidebar-active-shadow)]"
                    >
                      Select Documents
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'urls' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-10">
                     <h2 className="text-2xl font-black mb-2">Website Crawler</h2>
                     <p className="text-[var(--foreground-muted)] text-sm">Enter a URL to automatically crawl and index web pages.</p>
                  </div>
                  
                  <div className="bg-[var(--card-hover)] p-10 rounded-[40px] border border-[var(--border)] space-y-6">
                    <div className="relative group">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--primary)]" size={20} />
                      <input 
                        type="url" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/docs"
                        className="w-full bg-black/40 border border-[var(--border-strong)] rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-[var(--primary-light)] transition-all font-medium text-sm"
                      />
                    </div>
                    <button 
                      onClick={handleUrlImport}
                      disabled={isCrawling || !url}
                      className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-black py-5 rounded-2xl transition-all shadow-xl shadow-[var(--sidebar-active-shadow)] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isCrawling ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Crawling Knowledge...
                        </>
                      ) : (
                        <>
                          Start Crawling <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-10">
                     <h2 className="text-2xl font-black mb-2">Direct Knowledge</h2>
                     <p className="text-[var(--foreground-muted)] text-sm">Paste raw text data to directly feed the AI's memory.</p>
                  </div>
                  
                  <div className="bg-[var(--card-hover)] p-10 rounded-[40px] border border-[var(--border)] space-y-6">
                    <textarea 
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Paste instructions, FAQs, or raw data here..."
                      className="w-full bg-black/40 border border-[var(--border-strong)] rounded-2xl py-6 px-6 focus:outline-none focus:border-[var(--primary-light)] transition-all font-medium text-sm min-h-[250px] resize-none"
                    />
                    <button 
                      onClick={handleManualTextSave}
                      disabled={isSavingText || !manualText.trim()}
                      className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-black py-5 rounded-2xl transition-all shadow-xl shadow-[var(--sidebar-active-shadow)] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSavingText ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Saving to Vector Store...
                        </>
                      ) : (
                        <>
                          Train with Text <Plus size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Active Sources List */}
              <div className="mt-16 pt-12 border-t border-[var(--border)]">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black flex items-center gap-3">
                      Active Knowledge Base
                      <span className="bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--primary-light)]">
                        {sources.length} Sources
                      </span>
                   </h3>
                   <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] group-focus-within:text-[var(--primary)] transition-colors" size={14} />
                      <input 
                         type="text" 
                         placeholder="Filter sources..."
                         className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[var(--primary-light)] transition-all"
                      />
                   </div>
                </div>

                {loading ? (
                   <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[var(--foreground-subtle)]" size={32} /></div>
                ) : sources.length === 0 ? (
                   <div className="py-20 text-center bg-white/[0.01] rounded-[32px] border border-dashed border-[var(--border)]">
                      <Database className="text-[var(--foreground-subtle)] mx-auto mb-4" size={48} />
                      <p className="text-[var(--foreground-subtle)] font-bold text-sm uppercase tracking-widest">Neural Index is Empty</p>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {sources.map(source => (
                      <div key={source.id} className="flex items-center justify-between p-5 rounded-3xl bg-[var(--input-bg)] border border-[var(--border)] group hover:bg-white/[0.04] transition-all hover:scale-[1.01] duration-300">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-lg ${
                            source.type === 'file' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' : 
                            source.type === 'url' ? 'bg-[var(--primary-hover)]/10 text-[var(--primary)] border-[var(--primary-light)]' : 
                            'bg-purple-500/10 text-purple-500 border-purple-500/10'
                          }`}>
                            {source.type === 'file' ? <FileText size={20} /> : source.type === 'url' ? <Globe size={20} /> : <Type size={20} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black truncate max-w-[150px] sm:max-w-[300px] mb-1 group-hover:text-[var(--primary)] transition-colors">{source.name}</p>
                            <div className="flex items-center gap-3">
                               <span className="text-[10px] text-[var(--foreground-subtle)] uppercase font-black tracking-widest">{new Date(source.created_at).toLocaleDateString()}</span>
                               <div className="w-1 h-1 rounded-full bg-white/10" />
                               <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${source.status === 'ready' ? 'text-emerald-500' : 'text-[var(--primary)]'}`}>
                                 {source.status === 'ready' ? <CheckCircle2 size={12} /> : <Clock size={12} className="animate-spin" />}
                                 {source.status}
                               </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button className="p-3 text-[var(--foreground-subtle)] hover:text-[var(--foreground)] hover:bg-white/5 rounded-xl transition-all">
                              <ExternalLink size={18} />
                           </button>
                           <button 
                             onClick={() => handleDelete(source.id)}
                             className="p-3 text-[var(--foreground-subtle)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrainingCenter() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[var(--background)]"><Loader2 className="animate-spin text-[var(--primary)]" size={48} /></div>}>
      <TrainingContent />
    </Suspense>
  );
}
