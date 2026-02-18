"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Globe, Target, Linkedin, Zap, Factory, MapPin } from "lucide-react"

export default function SearchSection({ onScan, isScanning }: any) {
  const [formData, setFormData] = useState({
    industry: "",
    location: "",
    objective: "",
    ourLinkedin: "",
    ourWebsite: "", 
    targetLinkedin: "", // C'est ici que tu mets le lien du prospect
  })

  const handleSubmit = () => {
    if (!formData.industry || !formData.location || !formData.objective || !formData.ourLinkedin || !formData.targetLinkedin) {
      alert("Please fill in all required fields");
      return;
    }
    onScan(formData);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gradient-border rounded-2xl p-4 bg-black/20">
          <Label className="text-[10px] font-mono uppercase text-blue-400 flex items-center gap-2"><Factory className="w-3 h-3" /> Industry *</Label>
          <Input className="bg-transparent border-none focus-visible:ring-0 text-sm font-mono mt-1" placeholder="Real Estate, Tech..." value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} />
        </div>
        <div className="gradient-border rounded-2xl p-4 bg-black/20">
          <Label className="text-[10px] font-mono uppercase text-orange-400 flex items-center gap-2"><MapPin className="w-3 h-3" /> Target Location *</Label>
          <Input className="bg-transparent border-none focus-visible:ring-0 text-sm font-mono mt-1" placeholder="Paris, Dubai..." value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
        </div>
      </div>

      <div className="gradient-border rounded-2xl p-4 bg-black/20">
        <Label className="text-[10px] font-mono uppercase text-blue-500 flex items-center gap-2"><Linkedin className="w-3 h-3" /> Your LinkedIn Profile *</Label>
        <Input className="bg-transparent border-none focus-visible:ring-0 text-sm font-mono mt-1" placeholder="https://linkedin.com/in/..." value={formData.ourLinkedin} onChange={(e) => setFormData({...formData, ourLinkedin: e.target.value})} />
      </div>

      <div className="gradient-border rounded-2xl p-4 bg-black/20">
        <Label className="text-[10px] font-mono uppercase text-gray-400 flex items-center gap-2"><Globe className="w-3 h-3" /> Your Website (Optional)</Label>
        <Input className="bg-transparent border-none focus-visible:ring-0 text-sm font-mono mt-1" placeholder="https://..." value={formData.ourWebsite} onChange={(e) => setFormData({...formData, ourWebsite: e.target.value})} />
      </div>

      <div className="gradient-border rounded-2xl p-4 bg-black/20">
        <Label className="text-[10px] font-mono uppercase text-purple-400 flex items-center gap-2"><Target className="w-3 h-3" /> Campaign Objective *</Label>
        <Textarea className="bg-transparent border-none focus-visible:ring-0 text-sm font-mono mt-1 min-h-[60px]" placeholder="Pitching SEO services..." value={formData.objective} onChange={(e) => setFormData({...formData, objective: e.target.value})} />
      </div>

      <div className="gradient-border rounded-2xl p-6 glow-emerald bg-emerald-500/5 mt-6">
        <Label className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-2 mb-2">🚀 Lead to Scan (LinkedIn URL) *</Label>
        <Input placeholder="https://www.linkedin.com/company/..." className="h-12 bg-black/50 border-emerald-500/20 text-white font-mono" value={formData.targetLinkedin} onChange={(e) => setFormData({...formData, targetLinkedin: e.target.value})} />
      </div>

      <Button onClick={handleSubmit} disabled={isScanning} className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all">
        {isScanning ? "GENERATING STRATEGY..." : "EXECUTE STRATEGIC SCAN"}
      </Button>
    </div>
  )
}
