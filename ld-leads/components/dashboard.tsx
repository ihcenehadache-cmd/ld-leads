"use client"

import React, { useState } from "react"
import { Download, Rocket, ShieldCheck, Loader2, Globe, Building2, MapPin, UserCircle, Search } from "lucide-react"

export default function StrategicDashboard() {
  const [profile, setProfile] = useState("")
  const [objective, setObjective] = useState("")
  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)

  const downloadCSV = () => {
    if (!results) return
    const headers = "Company,Website,Decision Maker,Title,Email\n"
    const rows = results.leads.map((l: any) => `"${l.company}","${l.website}","${l.ceo}","${l.title}","${l.email}"`).join("\n")
    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `LD_LEADS_${industry.replace(/\s+/g, '_')}.csv`
    a.click()
  }

  const downloadPDF = () => {
    if (!results) return
    const win = window.open("", "_blank")
    if (!win) return
    win.document.write(`
      <html>
        <head><title>Strategy Report</title></head>
        <style>
          body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
          .header { border-bottom: 4px solid #00df81; padding-bottom: 10px; }
          .section { background: #f4f7f6; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #00df81; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #eee; padding: 10px; text-align: left; }
        </style>
        <body>
          <div class="header"><h1>LD-LEADS STRATEGIC REPORT</h1><p>${industry} - ${location}</p></div>
          <div class="section"><h3>STRATEGY</h3><p>${results.strategy}</p></div>
          <table>
            <thead><tr><th>Company</th><th>Decision Maker</th><th>Title</th><th>Website</th></tr></thead>
            <tbody>${results.leads.map((l: any) => `<tr><td>${l.company}</td><td>${l.ceo}</td><td>${l.title}</td><td>${l.website}</td></tr>`).join("")}</tbody>
          </table>
        </body>
      </html>
    `)
    win.document.close()
  }

  const startScan = async () => {
    if (!industry || !location) return alert("Please fill Industry and Location")
    setLoading(true)
    setResults(null)
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress(p => (p < 95 ? p + 1 : p))
    }, 200)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, objective, industry, location })
      })

      if (!response.ok) throw new Error("API_ERROR")

      const data = await response.json()
      setResults(data)
      setProgress(100)
    } catch (error) {
      console.error(error)
      alert("System Error: Check your OpenRouter API Key in .env.local and restart the server.")
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
          <h1 className="text-3xl font-black tracking-tighter italic">LD-LEADS</h1>
          <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 text-[10px] font-mono text-emerald-400 tracking-widest uppercase">Terminal_Active</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2"><Search size={14}/> Parameters</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1"><UserCircle size={14}/> Profile Info</label>
                  <textarea value={profile} onChange={(e)=>setProfile(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xs focus:border-emerald-500 outline-none h-24 resize-none" placeholder="Who are you?" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1"><Rocket size={14}/> Campaign Objective</label>
                  <textarea value={objective} onChange={(e)=>setObjective(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xs focus:border-emerald-500 outline-none h-24 resize-none" placeholder="Your goal?" />
                </div>
                <div className="space-y-4 pt-2">
                  <input value={industry} onChange={(e)=>setIndustry(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xs focus:border-emerald-500 outline-none" placeholder="Industry (e.g. Real Estate)" />
                  <input value={location} onChange={(e)=>setLocation(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xs focus:border-emerald-500 outline-none" placeholder="Location (e.g. Algiers)" />
                </div>
              </div>
              <button onClick={startScan} disabled={loading} className="w-full mt-10 py-5 bg-[#00df81] text-black font-black rounded-2xl hover:shadow-[0_0_40px_rgba(0,223,129,0.5)] transition-all uppercase text-[10px] flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={16}/> : <Rocket size={16}/>} Launch Intelligence
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {loading && (
              <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-emerald-500/20 shadow-xl">
                <div className="flex justify-between mb-5 items-end">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase animate-pulse block tracking-widest">Scanning OpenRouter Models...</span>
                    <h4 className="text-sm font-bold text-white italic mt-2 uppercase">Your leads will be ready in just few minutes</h4>
                  </div>
                  <span className="text-2xl font-black font-mono text-emerald-400">{progress}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-[1px] border border-white/10">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 min-h-[600px] shadow-2xl flex flex-col overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 italic">Strategic Intelligence</h2>
                {results && (
                  <div className="flex gap-3 animate-in fade-in duration-500">
                    <button onClick={downloadCSV} className="bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-bold px-5 py-3 rounded-2xl flex items-center gap-2 uppercase tracking-widest"><Download size={14}/> CSV</button>
                    <button onClick={downloadPDF} className="bg-[#00df81] text-black hover:bg-[#00f58d] text-[9px] font-bold px-5 py-3 rounded-2xl flex items-center gap-2 uppercase shadow-[0_0_20px_rgba(0,223,129,0.2)] tracking-widest"><ShieldCheck size={14}/> PDF Strategy</button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-auto">
                {results ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/[0.03] border-b border-white/5 font-mono text-gray-500 text-[9px] uppercase tracking-widest">
                      <tr><th className="p-6">Company</th><th className="p-6">Decision Maker</th><th className="p-6">Title</th><th className="p-6">Website</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {results.leads.map((l: any, i: number) => (
                        <tr key={i} className="hover:bg-emerald-500/[0.03] transition-colors">
                          <td className="p-6 font-bold text-white">{l.company}</td>
                          <td className="p-6 text-gray-300">{l.ceo}</td>
                          <td className="p-6"><span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400 uppercase">{l.title}</span></td>
                          <td className="p-6 text-emerald-500/50 underline italic">{l.website}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : !loading && (
                  <div className="flex flex-col items-center justify-center h-[500px] opacity-10"><Globe size={50}/><p className="mt-4 text-[10px] font-mono tracking-widest uppercase">System Standby</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

