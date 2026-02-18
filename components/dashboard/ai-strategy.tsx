"use client"

import React from 'react';
import { Sparkles, Send, Target, Zap } from 'lucide-react';

export default function AIStrategyCard({ strategy }: any) {
  if (!strategy) return null;

  return (
    <div className="bg-gradient-to-br from-[#00ff88]/10 via-black to-black border border-[#00ff88]/20 rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#00ff88]/20 rounded-lg">
          <Sparkles className="w-5 h-5 text-[#00ff88]" />
        </div>
        <h2 className="text-xl font-black tracking-tighter uppercase italic text-white">AI Intelligence</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-black text-[#00ff88] uppercase tracking-widest">
            <Zap className="w-3 h-3" /> The Hook
          </div>
          <p className="text-sm text-gray-300 italic">"{strategy.hook}"</p>
        </div>

        <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-black text-[#00ff88] uppercase tracking-widest">
            <Target className="w-3 h-3" /> Strategy
          </div>
          <p className="text-sm text-gray-300 uppercase leading-relaxed text-[10px] font-mono">
            {strategy.approachStrategy}
          </p>
        </div>

        <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-black text-[#00ff88] uppercase tracking-widest">
            <Send className="w-3 h-3" /> Channel
          </div>
          <div className="inline-block px-3 py-1 bg-[#00ff88] text-black text-[10px] font-black rounded-full uppercase">
            {strategy.bestChannel}
          </div>
        </div>
      </div>
    </div>
  );
}
