"use client"

import React, { useState, useEffect } from "react"
import { Zap, Database, LogOut, FileSpreadsheet, FileText, Timer, Globe, MapPin } from "lucide-react"

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [progress, setProgress] = useState(0)
  const [estimatedTime] = useState(12) // Temps estimé pour le scan

  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [objective, setObjective] = useState("")

  // --- PROGRESS BAR LOGIC ---
  useEffect(() => {
    let interval: any
    if (isLoading) {
      setProgress(0)
      interval = setInterval(() => {
        setProgress((prev) => (prev < 98 ? prev + (100 / (estimatedTime * 10)) : prev))
      }, 100)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isLoading, estimatedTime])

  const handleScan = async () => {
    if (!industry || !bio) return alert("Veuillez remplir les champs obligatoires")
    setIsLoading(true)
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, location, bio, objective }),
      })
      const data = await response.json()
      // On s'assure que les données collent aux colonnes LinkedIn
      setResults(data.leads || [])
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
      setProgress(100)
    }
  }

  // --- EXPORT CSV : FORMAT LINKEDIN ACCOUNT MATCH ---
  const downloadCSV = () => {
    // En-têtes exacts de ton fichier LinkedIn_Ads_Account_Match_Template.csv
    const headers = "companyname,companywebsite,companyemaildomain,linkedincompanypageurl,stocksymbol,industry,city,state,companycountry,zipcode\n"
    const rows = results.map(r => {
      const name = r.companyName || "N/A"
      const web = r.website || `${name.toLowerCase().replace(/\s/g, '')}.com`
      const domain = web.replace('https://', '').replace('http://', '').replace('www.', '')
      return `${name},${web},${domain},https://www.linkedin.com/company/${name.toLowerCase().replace(/\s/g, '-')},,${industry},${location},,FR,`
    }).join("\n")

    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = "LinkedIn_Account_Match_Export.csv"
    a.click()
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6">
        <div className="mb-12 text-6xl font-black italic text-white tracking-tighter">LD</div>
        <div className="w-full max-w-md bg-[#080808] border border-white/5 rounded-[2rem] p-10 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ff88] shadow-[0_0_15px_#00ff88]" />
          <div className="space-y-6">
            <input type="text" placeholder="EMAIL ADDRESS" className="w-full bg-black border border-white/10 rounded-xl h-14 px-4 text-[10px] font-bold tracking-widest text-white outline-none focus:border-[#00ff88]" />
            <input type="password" placeholder="ACCESS CODE" className="w-full bg-black border border-white/10 rounded-xl h-14 px-4 text-[10px] font-bold tracking-widest text-white outline-none focus:border-[#00ff88]" />
            <button onClick={() => setIsLoggedIn(true)} className="w-full h-14 bg-[#00ff88] text-black font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]">Access System</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 md:p-8 font-sans selection:bg-[#00ff88]/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <div className="text-4xl font-black italic tracking-tighter">LD</div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">System Dashboard</div>
          </div>
          <div className="text-[10px] font-mono text-[#00ff88] tracking-widest opacity-70 uppercase">
            Status: Online // test@ldleads.com
          </div>
        </div>

        {/* Form Panel */}
        <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Your Bio or Link</label>
              <textarea value={bio} onChange={(e)=>setBio(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm h-32 outline-none focus:border-[#00ff88] resize-none" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Campaign Objective</label>
              <textarea value={objective} onChange={(e)=>setObjective(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm h-32 outline-none focus:border-[#00ff88] resize-none" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest font-bold">Target Industry</label>
              <input value={industry} onChange={(e)=>setIndustry(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl h-14 px-5 text-sm outline-none focus:border-[#00ff88]" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-bold">Target Location</label>
              <input value={location} onChange={(e)=>setLocation(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl h-14 px-5 text-sm outline-none focus:border-[#00ff88]" />
            </div>
          </div>

          {/* New Loading Bar with Time */}
          {isLoading && (
            <div className="mb-8 space-y-3">
              <div className="flex justify-between items-end font-mono text-[9px] text-[#00ff88] uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2 animate-pulse">Scanning Global Database...</span>
                <span>Remaining: {Math.max(0, estimatedTime - Math.floor((progress/100)*estimatedTime))}s</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00ff88] transition-all duration-300 shadow-[0_0_15px_#00ff88]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}

          <button onClick={handleScan} disabled={isLoading} className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.5em] rounded-2xl hover:bg-gray-200 transition-all shadow-xl disabled:opacity-50">
            {isLoading ? "ANALYZING..." : "EXECUTE SYSTEM SCAN"}
          </button>
        </div>

        {/* Results Table Section */}
        <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-xs font-black text-[#00ff88] uppercase italic tracking-widest">
              DECRYPTED ACCOUNT DATA // {results.length} COMPANIES
            </h3>
            <div className="flex gap-3">
              <button onClick={downloadCSV} className="flex items-center gap-2 px-5 py-2.5 bg-[#00ff88] text-black text-[10px] font-black uppercase rounded-lg hover:brightness-110 transition-all">
                <FileSpreadsheet className="w-3 h-3" /> Export Account Match
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] text-gray-600 uppercase font-black border-b border-white/5 tracking-[0.2em]">
                  <th className="p-8">Company Name</th>
                  <th className="p-8">Website</th>
                  <th className="p-8 text-[#00ff88]">Industry</th>
                  <th className="p-8">City</th>
                  <th className="p-8">Country</th>
                  <th className="p-8 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.length > 0 ? results.map((lead, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-8 font-bold text-sm text-white uppercase tracking-tighter">{lead.companyName}</td>
                    <td className="p-8 text-gray-500 text-xs font-mono lowercase flex items-center gap-2">
                       <Globe className="w-3 h-3 opacity-30" /> {lead.website || `${lead.companyName.toLowerCase()}.com`}
                    </td>
                    <td className="p-8 text-gray-400 text-[10px] font-bold uppercase">{industry || lead.industry || 'Tech'}</td>
                    <td className="p-8 text-gray-500 text-[10px] font-bold uppercase flex items-center gap-2">
                       <MapPin className="w-3 h-3 opacity-30" /> {location || 'Paris'}
                    </td>
                    <td className="p-8 text-gray-500 text-[10px] font-bold uppercase">FRANCE</td>
                    <td className="p-8 text-right">
                       <span className="px-4 py-1.5 border border-[#00ff88]/30 text-[#00ff88] text-[9px] font-black uppercase rounded-md bg-[#00ff88]/5">READY</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-32 text-center text-[10px] font-mono uppercase tracking-[0.5em] text-gray-800 italic">
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

