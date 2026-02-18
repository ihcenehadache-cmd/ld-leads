"use client"

import { useEffect, useState } from "react"
import { Cpu, Database, Search, CheckCircle2, Circle, Radar } from "lucide-react"

interface ProcessSectionProps {
  isScanning: boolean
  progress: number
}

const stages = [
  { icon: Search, label: "Analyzing DNA Source", threshold: 0 },
  { icon: Database, label: "Extracting Signals", threshold: 33 },
  { icon: Cpu, label: "AI Processing", threshold: 66 },
  { icon: CheckCircle2, label: "Scan Complete", threshold: 100 },
]

export default function ProcessSection({ isScanning, progress }: ProcessSectionProps) {
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    if (progress < 33) setActiveStage(0)
    else if (progress < 66) setActiveStage(1)
    else if (progress < 100) setActiveStage(2)
    else setActiveStage(3)
  }, [progress])

  return (
    <div className="gradient-border rounded-2xl p-6 h-full glow-emerald">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Radar className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Agent Status</h2>
          <p className="text-xs font-mono text-muted-foreground">Real-time scan progress</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Progress</span>
          <span className="text-sm font-mono text-emerald-400 font-bold">{progress}%</span>
        </div>
        <div className="h-2 bg-[rgba(15,15,15,0.9)] rounded-full overflow-hidden relative border border-[rgba(52,211,153,0.2)]">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 rounded-full transition-all duration-300 relative"
            style={{ width: `${progress}%` }}
          >
            {isScanning && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[scan-line_1.5s_linear_infinite]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-2">
        {stages.map((stage, index) => {
          const isActive = index === activeStage && isScanning
          const isComplete = index < activeStage || (progress === 100 && index === 3)
          const Icon = stage.icon

          return (
            <div
              key={stage.label}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-emerald-500/10 border border-emerald-500/30"
                  : isComplete
                    ? "bg-emerald-500/5 border border-emerald-500/10"
                    : "bg-[rgba(15,15,15,0.5)] border border-transparent"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isComplete
                    ? "bg-emerald-500/20 text-emerald-400"
                    : isActive
                      ? "bg-emerald-500/20 text-emerald-400 animate-pulse"
                      : "bg-[rgba(25,25,25,0.8)] text-muted-foreground/50"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isActive ? (
                  <Icon className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={`text-xs font-mono uppercase tracking-wider transition-colors duration-300 ${
                  isComplete || isActive ? "text-white" : "text-muted-foreground/50"
                }`}
              >
                {stage.label}
              </span>
              {isActive && (
                <div className="ml-auto">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Status Message */}
      {!isScanning && progress === 0 && (
        <div className="mt-6 text-center py-4 border-t border-[rgba(52,211,153,0.1)]">
          <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">Awaiting Initialization</p>
        </div>
      )}
    </div>
  )
}