'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { X, Palette, MessageSquare, Loader2, Save } from 'lucide-react';

export default function AppearanceModal({ bot, isOpen, onClose, onSuccess }) {
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bot) {
      setThemeColor(bot.widget_color || '#2563eb');
      setWelcomeMessage(bot.welcome_msg || 'Hi! How can I help you today?');
    }
  }, [bot]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/bots/${bot.id}`, {
        ...bot,
        widget_color: themeColor,
        welcome_msg: welcomeMessage
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to save appearance');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-[#161618] w-full max-w-4xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left: Settings */}
        <div className="p-8 md:w-1/2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Palette size={24} className="text-blue-500" />
              Appearance
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Theme Color</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                />
                <input 
                  type="text" 
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Welcome Message</label>
              <textarea 
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px]"
                placeholder="Ex: Hi! How can I help you today?"
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Changes
          </button>
        </div>

        {/* Right: Live Preview */}
        <div className="bg-[#0f172a] md:w-1/2 p-8 flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(${themeColor} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
           
           <div className="w-full max-w-[320px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up relative z-10">
              <div className="p-4 flex items-center justify-between text-white" style={{ background: themeColor }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <MessageSquare size={16} />
                  </div>
                  <span className="font-bold text-sm">AI Assistant</span>
                </div>
                <X size={16} className="opacity-60" />
              </div>
              <div className="p-6 h-64 bg-gray-50">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none text-xs text-gray-800 shadow-sm inline-block max-w-[80%]">
                  {welcomeMessage || '...'}
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-2">
                <div className="flex-1 bg-gray-100 rounded-xl h-10"></div>
                <div className="w-10 h-10 rounded-xl" style={{ background: themeColor }}></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
