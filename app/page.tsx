"use client"

import React, { useState, useEffect } from "react"
import { FileSpreadsheet, Globe, MapPin, Trash2, CheckCircle2 } from "lucide-react"
import * as XLSX from 'xlsx'

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [strategy, setStrategy] = useState<any>(null)
  const [progress, setProgress] = useState(0)

  // Form Inputs
  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [objective, setObjective] = useState("")

  // --- PERSISTENCE: Load from LocalStorage on mount ---
  useEffect(() => {
    const savedLeads = localStorage.getItem("ld_leads_cache")
    const savedStrategy = localStorage.getItem("ld_strategy_cache")
    if (savedLeads) setResults(JSON.parse(savedLeads))
    if (savedStrategy) setStrategy(JSON.parse(savedStrategy))
  }, [])

  // --- SCAN LOGIC ---
  const handleScan = async () => {
    if (!industry || !location || !bio) return alert("Missing required fields")
    
    setIsLoading(true)
    setProgress(10) // Start progress

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, location, bio, objective }),
      })
      const data = await response.json()
      
      if (data.leads) {
        setResults(data.leads)
        setStrategy(data.strategy)
        
        // Save to local storage automatically
        localStorage.setItem("ld_leads_cache", JSON.stringify(data.leads))
        localStorage.setItem("ld_strategy_cache", JSON.stringify(data.strategy))
      }
    } catch (e) {
      console.error(e)
      alert("System Error: Search failed. Check your API route and keys.")
    } finally {
      setIsLoading(false)
      setProgress(100)
    }
  }

  // --- EXPORT: PERFECT LINKEDIN ACCOUNT MATCH EXCEL FORMAT ---
  const exportToExcel = () => {
    if (results.length === 0) return alert("No data to export");
    
    // Map data EXACTLY to the LinkedIn Ads Template headers
    const worksheetData = results.map(r => {
      const name = r.companyName || "N/A";
      const web = r.website || `${name.toLowerCase().replace(/\s/g, '')}.com`;
      
      // Auto-extract pure domain for LinkedIn's "companyemaildomain" requirement
      let domain = web;
      try {
        const urlObj = new URL(web.startsWith('http') ? web : `https://${web}`);
        domain = urlObj.hostname.replace('www.', '');
      } catch (e) {
        domain = web.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
      }

      // Auto-format LinkedIn URL best guess
      const linkedInUrl = `https://www.linkedin.com/company/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

      // This EXACT structure matches your LinkedIn template
      return {
        "companyname": name,
        "companywebsite": web,
        "companyemaildomain": domain,
        "linkedincompanypageurl": linkedInUrl,
        "stocksymbol": "",
        "industry": r.industry || industry,
        "city": r.city || location,
        "state": "",
        "companycountry": r.country || "FR", 
        "zipcode": ""
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Account_Match_Data");

    // Design: Set optimal Column Widths so data is readable in Excel
    worksheet['!cols'] = [
      { wch: 30 }, // companyname
      { wch: 30 }, // companywebsite
      { wch: 25 }, // companyemaildomain
      { wch: 50 }, // linkedincompanypageurl
      { wch: 15 }, // stocksymbol
      { wch: 25 }, // industry
      { wch: 20 }, // city
      { wch: 15 }, // state
      { wch: 15 }, // companycountry
      { wch: 15 }, // zipcode
    ];

    // Generate and download actual .xlsx file
    XLSX.writeFile(workbook, `LinkedIn_Account_Match_${industry.replace(/\s/g, '_').toUpperCase()}.xlsx`);
  }

  // --- WIPE MEMORY ---
  const clearData = () => {
    if(confirm("Wipe system memory? This will clear all extracted leads and strategy.")) {
      localStorage.removeItem("ld_leads_cache")
      localStorage.removeItem("ld_strategy_cache")
      setResults([])
      setStrategy(null)
    }
  }

  // --- LOGIN UI ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6">
        <div className="mb-12 text-6xl font-black italic text-white tracking-tighter">LD</div>
        <div className="w-full max-w-md bg-[#080808] border border-white/5 rounded-[2rem] p-10 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ff88]" />
          <div className="space-y-6">
            <input type="password" placeholder="ACCESS_ID" className="w-full bg-black border border-white/10 rounded-xl h-14 px-4 text-[10px] font-bold text-white outline-none focus:border-[#00ff88] tracking-[0.2em]" />
            <button onClick={() => setIsLoggedIn(true)} className="w-full h-14 bg-[#00ff88] text-black font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all">Initialize System</button>
          </div>
        </div>
      </div>
    )
  }

  // --- MAIN DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 md:p-8 font-sans selection:bg-[#00ff88]/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <div className="text-4xl font-black italic tracking-tighter">LD</div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> System: Live_Search_Grounded
            </div>
          </div>
          <button onClick={clearData} className="px-4 py-2 border border-red-500/30 text-red-500 text-[10px] font-bold uppercase rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
            <Trash2 className="w-3 h-3" /> Wipe Memory
          </button>
        </div>

        {/* Input Form Panel */}
        <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Your Bio or Link</label>
              <textarea value={bio} onChange={(e)=>setBio(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm h-32 outline-none focus:border-[#00ff88] resize-none" placeholder="e.g. I run a B2B SaaS agency..." />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Campaign Objective</label>
              <textarea value={objective} onChange={(e)=>setObjective(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm h-32 outline-none focus:border-[#00ff88] resize-none" placeholder="e.g. Book 15 min discovery calls..." />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest font-bold">Target Industry</label>
              <input value={industry} onChange={(e)=>setIndustry(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl h-14 px-5 text-sm outline-none focus:border-[#00ff88]" placeholder="e.g. Software Development" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest font-bold">Target Location</label>
              <input value={location} onChange={(e)=>setLocation(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl h-14 px-5 text-sm outline-none focus:border-[#00ff88]" placeholder="e.g. Paris, France" />
            </div>
          </div>

          {/* Loading Animation */}
          {isLoading && (
            <div className="mb-8 space-y-3">
              <div className="flex justify-between items-end font-mono text-[9px] text-[#00ff88] uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2 animate-pulse">Running Grounded Web Search...</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00ff88] transition-all duration-[2000ms] ease-out shadow-[0_0_15px_#00ff88]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}

          <button onClick={handleScan} disabled={isLoading} className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.5em] rounded-2xl hover:bg-gray-200 transition-all shadow-xl disabled:opacity-50">
            {isLoading ? "EXTRACTING LIVE DATA..." : "EXECUTE AI SEARCH"}
          </button>
        </div>

        {/* AI Strategy Insights Panel */}
        {strategy && (
          <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-3xl p-8 flex flex-col md:flex-row gap-8">
             <div className="flex-1 space-y-2">
               <h4 className="text-[10px] font-black text-[#00ff88] uppercase tracking-[0.2em]">Generated Outreach Hook</h4>
               <p className="text-sm text-gray-300 italic">"{strategy.hook}"</p>
             </div>
             <div className="flex-1 space-y-2">
               <h4 className="text-[10px] font-black text-[#00ff88] uppercase tracking-[0.2em]">Campaign Approach</h4>
               <p className="text-sm text-gray-300">{strategy.approachStrategy}</p>
             </div>
          </div>
        )}

        {/* Results Table & Export Section */}
        <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/[0.01]">
            <h3 className="text-xs font-black text-white uppercase italic tracking-widest">
              DECRYPTED ACCOUNT DATA // <span className="text-[#00ff88]">{results.length} COMPANIES</span>
            </h3>
            
            {/* LINKEDIN TEMPLATE EXPORT BUTTON */}
            <button 
              onClick={exportToExcel} 
              className="flex items-center justify-center gap-3 px-6 py-3 bg-[#00ff88] text-black text-[10px] font-black uppercase rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" /> 
              Download Account Match Data File
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] text-gray-600 uppercase font-black border-b border-white/5 tracking-[0.2em]">
                  <th className="p-8">Company Name</th>
                  <th className="p-8">Website</th>
                  <th className="p-8 text-[#00ff88]">Industry</th>
                  <th className="p-8">City</th>
                  <th className="p-8">Country Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.length > 0 ? results.map((lead, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-8 font-bold text-sm text-white uppercase tracking-tighter">{lead.companyName}</td>
                    <td className="p-8 text-gray-500 text-xs font-mono lowercase flex items-center gap-2">
                       <Globe className="w-3 h-3 opacity-30" /> {lead.website}
                    </td>
                    <td className="p-8 text-gray-400 text-[10px] font-bold uppercase">{lead.industry}</td>
                    <td className="p-8 text-gray-500 text-[10px] font-bold uppercase flex items-center gap-2">
                       <MapPin className="w-3 h-3 opacity-30" /> {lead.city}
                    </td>
                    <td className="p-8 text-gray-500 text-[10px] font-bold uppercase">{lead.country}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-32 text-center text-[10px] font-mono uppercase tracking-[0.5em] text-gray-800 italic">
                      SYSTEM_STANDBY // NO_PAYLOAD_DETECTED
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}