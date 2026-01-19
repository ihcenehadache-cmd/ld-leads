"use client"

import React, { useState } from "react"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"

interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulation d'une petite attente pour l'effet "Cyber"
    setTimeout(() => {
      onLogin()
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Grid Subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Orbes de lumière en arrière-plan */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-block relative">
            <h1 className="text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              LD
            </h1>
            <div className="h-[3px] w-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 rounded-full mt-1 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
          </div>
          <p className="text-gray-500 text-[10px] font-medium tracking-[0.4em] uppercase mt-4 opacity-80">
            Strategic Lead Intelligence
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative group">
          {/* Glow effect around card */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
          
          <form onSubmit={handleSubmit} className="relative space-y-7">
            {/* Email Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="agent@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-black/50 border border-white/10 text-white placeholder:text-gray-700 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none rounded-xl px-4 transition-all text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Access Code
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-black/50 border border-white/10 text-white placeholder:text-gray-700 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none rounded-xl px-4 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Access Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-14 bg-[#00df81] hover:bg-[#00f58d] text-black font-black text-xs tracking-[0.15em] uppercase rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(0,223,129,0.3)] hover:shadow-[0_0_40px_rgba(0,223,129,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Access System
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="text-center">
            <button className="text-[10px] font-bold text-gray-600 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">
              Request Access Recovery
            </button>
          </div>
        </div>
        
        {/* Security Indicator */}
        <div className="mt-8 flex justify-center items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[9px] font-mono text-emerald-500/60 uppercase tracking-widest">Secure Terminal Online</span>
        </div>
      </div>
    </div>
  )
}

                