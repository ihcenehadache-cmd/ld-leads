"use client";
import React, { useState } from 'react';

export default function LeadDashboard() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [strategy, setStrategy] = useState("");
  const [formData, setFormData] = useState({ industry: "", location: "", objective: "" });

  const handleScan = async () => {
    if (!formData.industry || !formData.location) {
      alert("Please fill Industry and Location");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResults(data.leads || []);
      setStrategy(data.strategy || "");
    } catch (e) {
      alert("Error during scan");
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    const headers = "Company,CEO,Title,Website,Email\n";
    const rows = results.map(r => `"${r.company}","${r.ceo}","${r.title}","${r.website}","${r.email}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-export.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">AI Lead Scanner <span className="text-blue-500 text-sm font-normal">(TEST MODE)</span></h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Industry (ex: Real Estate)" 
              onChange={(e) => setFormData({...formData, industry: e.target.value})} 
            />
            <input 
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Location (ex: Algiers)" 
              onChange={(e) => setFormData({...formData, location: e.target.value})} 
            />
            <input 
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Your Objective" 
              onChange={(e) => setFormData({...formData, objective: e.target.value})} 
            />
            <button 
              onClick={handleScan} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-blue-300"
            >
              {loading ? "Scanning..." : "Generate Leads"}
            </button>
          </div>
        </div>

        {/* AI Strategy Section */}
        {strategy && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h2 className="font-bold text-blue-800 mb-1">AI Growth Strategy</h2>
            <p className="text-blue-900 text-sm italic">{strategy}</p>
          </div>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-700">Scan Results ({results.length})</h2>
              <div className="flex gap-2">
                <button onClick={downloadCSV} className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">CSV</button>
                <button onClick={() => window.print()} className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">PDF</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3">Company</th>
                    <th className="p-3">CEO / Director</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Website</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-medium">{r.company}</td>
                      <td className="p-3">{r.ceo}</td>
                      <td className="p-3 text-blue-600 underline">{r.email}</td>
                      <td className="p-3 text-gray-500">{r.website}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
