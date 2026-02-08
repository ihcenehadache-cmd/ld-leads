"use client";
import React, { useState } from 'react';

export default function LeadIntelligence() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loginData, setLoginData] = useState({ email: "", code: "" });
  const [formData, setFormData] = useState({ bio: "", objective: "", industry: "", location: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email === "test@ldleads.com" && loginData.code === "leads2026") {
      setIsAuthenticated(true);
    } else {
      alert("ACCESS DENIED");
    }
  };

  const handleScan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResults(data.leads || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // --- FONCTION EXPORT CSV ---
  const exportCSV = () => {
    const headers = "Company,Website,Decision Maker,Title,Email\n";
    const rows = results.map(r => `"${r.company}","${r.website}","${r.ceo}","${r.title}","${r.email}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LD_INTEL_REPORT.csv';
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020202] text-white font-mono flex flex-col items-center justify-center p-8">
        <div className="text-7xl font-black italic mb-8 tracking-tighter">LD</div>
        <form onSubmit={handleLogin} className="w-full max-w-md bg-black border-t-2 border-cyan-500 p-10 rounded-b-3xl shadow-2xl space-y-6">
          <input type="email" placeholder="IDENTITY@LDLEADS.COM" className="w-full bg-[#111] border border-gray-800 p-4 rounded text-xs outline-none focus:border-cyan-500" 
            onChange={(e)=>setLoginData({...loginData, email: e.target.value})} />
          <input type="password" placeholder="ACCESS_CODE" className="w-full bg-[#111] border border-gray-800 p-4 rounded text-xs outline-none focus:border-cyan-500" 
            onChange={(e)=>setLoginData({...loginData, code: e.target.value})} />
          <button type="submit" className="w-full bg-cyan-600 text-black font-black py-4 rounded uppercase tracking-widest text-[10px]">Verify</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 font-mono p-4 md:p-12 relative">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-900 pb-8 text-white font-bold italic">
          <div className="text-5xl tracking-tighter">LD</div>
          <div className="text-[10px] text-cyan-500 tracking-[0.3em] uppercase animate-pulse">System Online // {loginData.email}</div>
        </div>

        {/* 4 Inputs Section */}
        <div className="bg-[#050505] border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gray-500">Your Bio or Link</label>
              <input 
                className="w-full bg-black border border-gray-800 p-4 rounded-xl text-xs text-white focus:border-cyan-500 outline-none" 
                placeholder="SOURCE DATA..." 
                onChange={(e)=>setFormData({...formData, bio: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gray-500">Campaign Objective</label>
              <input 
                className="w-full bg-black border border-gray-800 p-4 rounded-xl text-xs text-white focus:border-cyan-500 outline-none" 
                placeholder="GOAL..." 
                onChange={(e)=>setFormData({...formData, objective: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-cyan-500 font-bold">Target Industry</label>
              <input 
                className="w-full bg-black border border-gray-800 p-4 rounded-xl text-xs text-white focus:border-cyan-500 outline-none" 
                placeholder="SECTOR..." 
                onChange={(e)=>setFormData({...formData, industry: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gray-500">Target Location</label>
              <input 
                className="w-full bg-black border border-gray-800 p-4 rounded-xl text-xs text-white focus:border-cyan-500 outline-none" 
                placeholder="REGION..." 
                onChange={(e)=>setFormData({...formData, location: e.target.value})} 
              />
            </div>
          </div>
          <button 
            onClick={handleScan}
            className="w-full mt-8 bg-white hover:bg-cyan-500 text-black font-black py-4 rounded-xl uppercase text-[10px] tracking-[0.4em] transition-all shadow-lg"
          >
            {loading ? "INITIALIZING SCAN..." : "EXECUTE SYSTEM SCAN"}
          </button>
        </div>

        {/* Intelligence Table */}
        {results.length > 0 && (
          <div className="bg-[#050505] border border-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50">
              <span className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase italic">Decrypted Data: {results.length} Leads</span>
              
              {/* BOUTONS EXPORT SIDE-BY-SIDE */}
              <div className="flex gap-4">
                <button 
                  onClick={exportCSV}
                  className="bg-gray-900 hover:bg-[#00ff9d] hover:text-black border border-gray-800 text-[9px] px-4 py-2 rounded font-bold transition-all tracking-widest uppercase"
                >
                  Export CSV
                </button>
                <button 
                  onClick={() => window.print()}
                  className="bg-gray-900 hover:bg-cyan-500 hover:text-black border border-gray-800 text-[9px] px-4 py-2 rounded font-bold transition-all tracking-widest uppercase"
                >
                  Export PDF
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-[#080808] text-gray-500 uppercase tracking-widest border-b border-gray-900">
                  <tr>
                    <th className="p-5">Company</th>
                    <th className="p-5">Website</th>
                    <th className="p-5 text-cyan-500">Decision Maker</th>
                    <th className="p-5">Title</th>
                    <th className="p-5 text-white">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-cyan-900/5 transition-all group">
                      <td className="p-5 text-white font-bold group-hover:text-cyan-400">{r.company}</td>
                      <td className="p-5 text-gray-600 font-mono italic">{r.website}</td>
                      <td className="p-5 text-gray-400 uppercase font-bold">{r.ceo}</td>
                      <td className="p-5 text-gray-600 italic tracking-widest">{r.title}</td>
                      <td className="p-5 text-cyan-700 font-black">{r.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
