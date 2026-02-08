"use client"

import React, { useState } from "react"
import { Zap, Database, ArrowRight, Sparkles, Send, Target } from "lucide-react"

// --- COMPOSANT STRATÉGIE (INCLUS DIRECTEMENT) ---
function LocalAIStrategyCard({ strategy }: any) {
  if (!strategy) return null;
  return (
    <div className="bg-gradient-to-br from-[#00ff88]/10 via-black to-black border border-[#00ff88]/20 rounded-[2.5rem] p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 text-white font-black italic uppercase tracking-tighter">
        <Sparkles className="w-5 h-5 text-[#00ff88]" /> AI STRATEGIC INTELLIGENCE
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-[9px] font-black text-[#00ff88] uppercase mb-2 flex items-center gap-2"><Zap className="w-3 h-3"/> The Hook</div>
          <p className="text-sm text-gray-300 italic">"{strategy.hook}"</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-[9px] font-black text-[#00ff88] uppercase mb-2 flex items-center gap-2"><Target className="w-3 h-3"/> Strategy</div>
          <p className="text-[10px] text-gray-300 font-mono uppercase leading-relaxed">{strategy.approachStrategy}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
          <div className="text-[9px] font-black text-[#00ff88] uppercase mb-2"><Send className="w-3 h-3 inline mr-1"/> Channel</div>
          <span className="bg-[#00ff88] text-black px-3 py-1 rounded-full text-[10px] font-black uppercase">{strategy.bestChannel}</span>
        </div>
      </div>
    </div>
  );
}

// --- PAGE DASHBOARD PRINCIPALE ---
export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [strategy, setStrategy] = useState<any>(null)
  
  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [objective, setObjective] = useState("")

  const handleScan = async () => {
    if (!industry || !bio || !objective) {
      alert("Champs manquants")
      return
    }
    setIsLoading(true)
    setStrategy(null)
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, location, bio, objective }),
      })
      const data = await response.json()
      setResults(data.leads || [])
      setStrategy(data.strategy || null)
    } catch (error) {
      alert("Erreur API")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 md:p-8 font-sans selection:bg-[#00ff88]/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 flex items-center justify-center border border-[#00ff88]/20">
              <Zap className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">LD-LEADS <span className="text-[#00ff88] text-xs font-mono not-italic ml-2">CORE V2</span></h1>
          </div>
          <div className="bg-white/[0.03] px-6 py-2 rounded-full border border-white/10 flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-[#00ff88]'}`} />
             <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00ff88]">
               {isLoading ? "Running Scan..." : "System Ready"}
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-7 rounded-[2.5rem] border border-white/10 bg-white/[0.02] space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase">Target Industry</label>
                <input value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl h-12 px-4 text-sm" placeholder="ex: Agences Web" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl h-12 px-4 text-sm" placeholder="ex: Paris, Lyon" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Your Expertise</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm h-24" placeholder="Qui êtes-vous ?" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Campaign Goal</label>
                <textarea value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm h-24" placeholder="But du scan ?" />
              </div>
              <button onClick={handleScan} disabled={isLoading} className="w-full h-14 bg-[#00ff88] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#00cc6a] transition-all flex items-center justify-center gap-2">
                {isLoading ? "CHARGEMENT..." : "EXECUTE SCAN"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-8 space-y-6">
            {isLoading && (
              <div className="p-8 border border-[#00ff88]/20 bg-[#00ff88]/5 rounded-[2.5rem] text-center">
                <div className="w-full bg-white/5 h-1 rounded-full mb-4 overflow-hidden">
                   <div className="h-full bg-[#00ff88] w-full animate-pulse" />
                </div>
                <p className="text-[10px] font-mono text-[#00ff88] animate-pulse">QUERYING SIRENE DATA LAKE...</p>
              </div>
            )}

            {strategy && <LocalAIStrategyCard strategy={strategy} />}

            <div className="bg-black border border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Database className="w-3 h-3 text-[#00ff88]" /> Raw Extraction</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-gray-600 uppercase font-bold bg-white/[0.02]">
                    <tr><th className="p-6">Company</th><th className="p-6">Activity</th><th className="p-6 text-right">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {results.map((lead, i) => (
                      <tr key={i} className="text-sm hover:bg-white/[0.02]">
                        <td className="p-6 font-bold">{lead.companyName}</td>
                        <td className="p-6 text-gray-500">{lead.jobTitle}</td>
                        <td className="p-6 text-right font-mono text-[10px] text-[#00ff88]">VERIFIED</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
