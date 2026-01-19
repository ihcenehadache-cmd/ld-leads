"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MessageSquare, Mail, Download, Lightbulb, Route, Megaphone, FileText } from "lucide-react"
import type { AIStrategy, LeadResult } from "../dashboard"

interface AIStrategyCardProps {
  strategy: AIStrategy
  results: LeadResult[]
}

export default function AIStrategyCard({ strategy, results }: AIStrategyCardProps) {
  const downloadCSV = () => {
    const headers = ["Company Name", "Website", "LinkedIn Profile", "CEO/Manager", "Email", "Matching Signal"]
    const csvContent = [
      headers.join(","),
      ...results.map((r) =>
        [r.companyName, r.website, r.linkedinProfile, r.ceoName, r.email, `"${r.matchingSignal}"`].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ld-leads-export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const downloadPDF = () => {
    // Simulate PDF download
    alert("Strategic PDF generation would be implemented with a PDF library like jspdf")
  }

  return (
    <div className="gradient-border rounded-2xl p-6 glow-mixed">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">AI Strategic Analysis</h2>
            <p className="text-xs font-mono text-muted-foreground">Personalized outreach intelligence</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={downloadCSV}
            className="h-10 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-mono text-xs uppercase tracking-wider rounded-xl border border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
          <Button
            onClick={downloadPDF}
            className="h-10 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 font-mono text-xs uppercase tracking-wider rounded-xl border border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(129,140,248,0.2)]"
          >
            <FileText className="w-4 h-4 mr-2" />
            Download Strategic PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* The Hook */}
        <div className="gradient-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">The Hook</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            {'"'}
            {strategy.hook}
            {'"'}
          </p>
        </div>

        {/* Approach Strategy */}
        <div className="gradient-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Route className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Approach Strategy</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{strategy.approachStrategy}</p>
        </div>

        {/* Best Channel */}
        <div className="gradient-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Best Channel</h3>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Badge
              className={`text-sm font-mono py-2 px-4 ${
                strategy.bestChannel === "LinkedIn Message"
                  ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
              }`}
            >
              {strategy.bestChannel === "LinkedIn Message" ? (
                <MessageSquare className="w-4 h-4 mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              {strategy.bestChannel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground/60 font-mono">
            Based on target profile analysis and historical response rates.
          </p>
        </div>
      </div>
    </div>
  )
}


