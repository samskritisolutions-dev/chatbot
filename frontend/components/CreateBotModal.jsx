'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { X, Loader2, Sparkles, MessageSquare, Shield } from 'lucide-react';

export default function CreateBotModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/bots', { 
        bot_name: name, 
        system_prompt: prompt, 
        is_active: true 
      });
      setName('');
      setPrompt('');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#161618] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">New AI Agent</h2>
              <p className="text-sm text-gray-500">Configure your bot's personality</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Agent Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="e.g. Customer Support Bot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-400">System Prompt (Instructions)</label>
              <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded uppercase">Advanced</span>
            </div>
            <textarea 
              required
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="Example: You are a helpful assistant for a SaaS platform. Your tone is professional and friendly..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <p className="text-[11px] text-gray-500">This defines how your bot behaves and what knowledge it has access to.</p>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-4 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <MessageSquare size={18} />
                  Deploy Agent
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
