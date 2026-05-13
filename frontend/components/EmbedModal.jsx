'use client';
import React, { useState } from 'react';
import { Copy, Check, Code, X, Zap } from 'lucide-react';

export default function EmbedModal({ bot, onClose }) {
  const [copied, setCopied] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';
  
  const embedCode = `<!-- AI Chatbot Embed -->
<script 
  src="${baseUrl}/widget.js" 
  data-bot-uid="${bot.bot_uid}" 
  defer
></script>
<!-- End AI Chatbot Embed -->`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#161618] rounded-[24px] w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-br from-blue-600/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Code size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-none mb-1">Deploy {bot.bot_name}</h3>
              <p className="text-sm text-gray-500">Copy the snippet below to your website</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative">
              <pre className="bg-[#09090b] text-blue-400 p-6 rounded-2xl text-xs font-mono overflow-x-auto border border-white/5 shadow-inner leading-relaxed scrollbar-hide">
                {embedCode}
              </pre>
              <button
                onClick={copyToClipboard}
                className={`absolute top-4 right-4 p-3 rounded-xl transition-all duration-300 ${
                  copied 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/5 text-white hover:bg-white/10 backdrop-blur-xl border border-white/10'
                }`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-5 bg-blue-600/5 rounded-2xl border border-blue-500/10">
              <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center shrink-0">
                <Code size={14} className="text-blue-400" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Paste this code just before the <code className="text-blue-300 font-mono">&lt;/body&gt;</code> tag of your website.
              </p>
            </div>
            <div className="flex items-start gap-4 p-5 bg-purple-600/5 rounded-2xl border border-purple-500/10">
              <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center shrink-0">
                <Zap size={14} className="text-purple-400" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                The widget will automatically sync with your bot's <b>Custom Theme</b> settings.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 py-3 bg-white/[0.02] border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-all shadow-xl active:scale-95"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
