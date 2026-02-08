"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Database, Signal, ShieldCheck } from "lucide-react"

// Interface alignée avec ton nouveau format hybride
interface LeadResult {
  id?: string;
  companyName: string;
  companyWebsite: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  profileUrl: string;
}

interface ResultsTableProps {
  results: LeadResult[]
}

function ResultsTable({ results }: ResultsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // --- ÉTAT VIDE (Look Emerald) ---
  if (results.length === 0) {
    return (
      <div className="rounded-[2.5rem] border border-white/5 bg-[#080808]/90 p-12 backdrop-blur-2xl">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#00ff88]/5 flex items-center justify-center mx-auto mb-4 border border-[#00ff88]/10">
            <Database className="w-7 h-7 text-[#00ff88]/20" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">No Intelligence Scanned</h3>
          <p className="text-xs font-mono text-gray-500 max-w-md mx-auto">
            Please enter target parameters to initialize LD-LEADS extraction.
          </p>
        </div>
      </div>
    )
  }

  // --- TABLEAU DE RÉSULTATS (Format Contrat & Pitch Deck) ---
  return (
    <div className="rounded-[2.5rem] border border-white/5 bg-[#080808]/90 p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
      {/* Glow effect décoratif */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 flex items-center justify-center border border-[#00ff88]/20">
            <ShieldCheck className="w-6 h-6 text-[#00ff88]" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Strategic Lead Intelligence</h2>
            <p className="text-[10px] font-mono text-[#00ff88]/70 uppercase">{results.length} Entities Decrypted</p>
          </div>
        </div>
        <Badge className="border-[#00ff88]/30 text-[#00ff88] bg-[#00ff88]/10 font-mono text-[10px] uppercase tracking-tighter py-1 px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse mr-2" />
          Secure Connection Active
        </Badge>
      </div>

      <div className="rounded-2xl border border-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent bg-white/[0.02]">
              <TableHead className="text-gray-500 font-mono text-[10px] uppercase tracking-widest p-5">
                Company Entity
              </TableHead>
              <TableHead className="text-gray-500 font-mono text-[10px] uppercase tracking-widest p-5">
                Digital Domain
              </TableHead>
              <TableHead className="text-[#00ff88] font-mono text-[10px] uppercase tracking-widest p-5">
                Target Decision Maker
              </TableHead>
              <TableHead className="text-white font-mono text-[10px] uppercase tracking-widest p-5 text-right">
                Direct Access (Email)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow
                key={result.id || index}
                className="border-white/5 hover:bg-[#00ff88]/[0.02] transition-colors group"
              >
                <TableCell className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-bold text-white text-xs group-hover:text-[#00ff88] transition-colors uppercase">
                      {result.companyName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="p-5">
                  <a
                    href={result.companyWebsite.startsWith('http') ? result.companyWebsite : `https://${result.companyWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white flex items-center gap-1 transition-colors text-[11px] font-mono italic"
                  >
                    {result.companyWebsite.replace('https://', '').replace('www.', '')}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </TableCell>
                <TableCell className="p-5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-200">
                      {result.firstName} {result.lastName}
                    </span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-tighter">
                      {result.jobTitle}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="p-5 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <code className="text-[11px] text-[#00ff88] font-black tracking-widest bg-[#00ff88]/5 px-2 py-1 rounded">
                      {result.email}
                    </code>
                    <a 
                      href={result.profileUrl} 
                      target="_blank" 
                      className="text-gray-600 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ResultsTable;
export { ResultsTable };
