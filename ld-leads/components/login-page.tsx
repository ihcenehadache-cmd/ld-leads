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
    
    // Effet de chargement système avant d'entrer
    setTimeout(() => {
      onLogin()
      setIsSubmitting(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* 1. GRILLE D'ARRIÈRE-PLAN ANIMÉE (DESIGN ORIGINAL) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* 2. ORBES DE COULEURS (CYBER GLOW) */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* LOGO SECTION */}
        <div className="text-center mb-12">
          <div className="inline-block relative group">
            <h1 className="text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all group-hover:drop-shadow-[0_0_30px_rgba(52,211,153,0.6)]">
              LD
            </h1>
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-600 rounded-full mt-1 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
          </div>
          <p className="text-emerald-500/60 text-[10px] font-mono font-bold tracking-[0.5em] uppercase mt-6">
            Strategic Lead Intelligence
          </p>
        </div>

        {/* LOGIN CARD (DESIGN ÉPURÉ & MODERNE) */}
        <div className="bg-[#080808]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          {/* Ligne d'accentuation en haut de la carte */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* EMAIL */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Operator Email
              </label>
              <input
                type="email"
                required
                placeholder="agent@ldleads.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-black/60 border border-white/10 text-white placeholder:text-gray-800 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/5 outline-none rounded-2xl px-5 transition-all text-sm font-mono"
              />
            </div>

            {/* PASSWORD / ACCESS CODE */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                System Access Code
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-black/60 border border-white/10 text-white placeholder:text-gray-800 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/5 outline-none rounded-2xl px-5 transition-all text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* BOUTON D'ACCÈS (LE VERT VIF DU DESIGN ORIGINAL) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-16 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-black font-black text-sm tracking-[0.2em] uppercase rounded-2xl transition-all duration-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(52,211,153,0.5)] active:scale-[0.97] flex items-center justify-center gap-3 relative group overflow-hidden ${isSubmitting ? 'opacity-80' : ''}`}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  INITIATE SESSION
                </>
              )}
            </button>
          </form>

          {/* SÉPARATEUR */}
          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <span className="text-[9px] font-bold text-gray-800 uppercase tracking-widest">Security Protocol</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>

          <div className="text-center">
            <button className="text-[10px] font-bold text-gray-700 hover:text-emerald-500 transition-all uppercase tracking-[0.25em] underline underline-offset-8 decoration-gray-900 hover:decoration-emerald-500">
              Recover Credentials
            </button>
          </div>
        </div>
        
        {/* STATUS BAR */}
        <div className="mt-12 flex flex-col items-center gap-3">
           <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
              <span className="text-[9px] font-mono text-emerald-500 tracking-[0.2em] uppercase">Encrypted Connection Established</span>
           </div>
           <p className="text-[8px] text-gray-700 font-mono uppercase tracking-[0.1em]">AES-256 Bit Terminal Access</p>
        </div>
      </div>
    </div>
  )
}

                