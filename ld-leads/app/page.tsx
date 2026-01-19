"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LeadDashboard() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [strategy, setStrategy] = useState("");
  const [formData, setFormData] = useState({ industry: "", location: "", objective: "" });

  const handleScan = async () => {
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
    a.download = 'leads.csv';
    a.click();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader><CardTitle>AI Lead Scanner (TEST MODE)</CardTitle></CardHeader>
        <CardContent className="flex gap-4">
          <Input placeholder="Industry" onChange={(e) => setFormData({...formData, industry: e.target.value})} />
          <Input placeholder="Location" onChange={(e) => setFormData({...formData, location: e.target.value})} />
          <Button onClick={handleScan} disabled={loading}>
            {loading ? "Scanning..." : "Generate Leads"}
          </Button>
        </CardContent>
      </Card>

      {strategy && (
        <Card className="bg-blue-50">
          <CardContent className="p-4"><p>{strategy}</p></CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Results ({results.length})</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" onClick={downloadCSV}>Export CSV</Button>
              <Button variant="outline" onClick={() => window.print()}>Print PDF</Button>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Company</th>
                  <th className="p-2">CEO</th>
                  <th className="p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{r.company}</td>
                    <td className="p-2">{r.ceo}</td>
                    <td className="p-2 text-blue-600">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
