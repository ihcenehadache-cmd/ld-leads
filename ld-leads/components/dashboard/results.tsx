"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Database, Signal } from "lucide-react"
import type { LeadResult } from "../dashboard"

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

  if (results.length === 0) {
    return (
      <div className="gradient-border rounded-2xl p-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 flex items-center justify-center mx-auto mb-4">
            <Database className="w-7 h-7 text-muted-foreground/30" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">No Data Yet</h3>
          <p className="text-xs font-mono text-muted-foreground/60 max-w-md mx-auto">
            Initialize strategic scan to discover leads
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-border rounded-2xl p-6 glow-indigo">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Lead Intelligence</h2>
            <p className="text-xs font-mono text-muted-foreground">{results.length} targets identified</p>
          </div>
        </div>
        <Badge className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono text-xs uppercase tracking-wider">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
          Live Data
        </Badge>
      </div>

      <div className="rounded-xl border border-[rgba(129,140,248,0.15)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[rgba(129,140,248,0.1)] hover:bg-transparent bg-[rgba(10,10,10,0.5)]">
              <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                Company
              </TableHead>
              <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                Website
              </TableHead>
              <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                CEO/Manager
              </TableHead>
              <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                LinkedIn
              </TableHead>
              <TableHead className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  Matching Signal
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow
                key={result.id}
                className="border-[rgba(129,140,248,0.08)] hover:bg-indigo-500/5 transition-colors"
              >
                <TableCell className="font-medium text-white text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {result.companyName}
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={`https://${result.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors text-sm font-mono"
                  >
                    {result.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </TableCell>
                <TableCell className="text-foreground text-sm">{result.ceoName}</TableCell>
                <TableCell>
                  <a
                    href={`https://${result.linkedinProfile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors text-xs font-mono"
                  >
                    View
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/20 text-emerald-400/80 bg-emerald-500/5 font-normal text-xs"
                  >
                    {result.matchingSignal}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ResultsTable
export { ResultsTable }
