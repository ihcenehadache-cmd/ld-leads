"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface HeaderProps {
  leadsRemaining: number
  maxLeads: number
  onLogout: () => void
}

export default function DashboardHeader({ leadsRemaining, maxLeads, onLogout }: HeaderProps) {
  return (
    <header className="gradient-border rounded-2xl px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black tracking-tighter text-white">LD</h1>
          <div className="h-6 w-px bg-gradient-to-b from-emerald-500/50 to-indigo-500/50" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Leads</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Trial Mode Badge */}
          <div className="gradient-border rounded-xl px-4 py-2.5 glow-emerald">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Trial Mode</span>
              </div>
              <div className="h-4 w-px bg-[rgba(52,211,153,0.3)]" />
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold font-mono text-white">{leadsRemaining}</span>
                <span className="text-xs text-muted-foreground font-mono">LEADS REMAINING</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-white hover:bg-[rgba(52,211,153,0.1)] transition-all"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

