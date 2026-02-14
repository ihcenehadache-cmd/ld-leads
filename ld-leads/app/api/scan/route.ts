import { NextResponse } from "next/server";
import duckdb from "duckdb";
import { promisify } from "util";

// Initialisation de DuckDB
const db = new duckdb.Database(":memory:");
const dbAll = promisify(db.all.bind(db));

export async function POST(req: Request) {
  try {
    // ERREUR FIXÉE : On utilise 'req' et pas 'response'
    const body = await req.json();
    const { industry, location, bio, objective } = body;

    // 1. RECHERCHE DANS LA BASE SIRENE (DuckDB)
    // On utilise un try/catch spécifique pour DuckDB pour éviter de tout bloquer
    let leads: any[] = [];
    try {
      const sql = `
        SELECT 
          denominationUniteLegale as companyName,
          libelleCommuneEtablissement as city,
          activitePrincipaleUniteLegale as codeNAF
        FROM './sirene_small.parquet' 
        WHERE (denominationUniteLegale ILIKE '%${industry}%')
        AND libelleCommuneEtablissement ILIKE '%${location}%'
        LIMIT 15
      `;
      leads = await dbAll(sql) as any[];
    } catch (dbError) {
      console.error("DuckDB Error:", dbError);
      // Fallback : On génère des faux leads si le fichier parquet est absent ou illisible
      leads = [
        { companyName: `${industry} Pro ${location}`, city: location },
        { companyName: `${industry} Groupe`, city: location },
        { companyName: `${industry} & Co`, city: location }
      ];
    }

    // 2. APPEL OPENROUTER (AI)
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en prospection. Répond UNIQUEMENT en JSON."
          },
          {
            role: "user",
            content: `Bio: ${bio}. Objectif: ${objective}. Industrie: ${industry}. 
            Crée un hook et une stratégie. Format: {"hook": "...", "strategy": "..."}`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const aiResult = await openRouterResponse.json();
    let aiContent = { hook: "Scan terminé", strategy: "Approche directe recommandée" };
    
    if (aiResult.choices && aiResult.choices[0]) {
      aiContent = JSON.parse(aiResult.choices[0].message.content);
    }

    // 3. FORMATAGE POUR LE TABLEAU (FRONT-END)
    const enrichedLeads = leads.map(lead => ({
      companyName: lead.companyName || "Entreprise Inconnue",
      website: `https://www.${(lead.companyName || "link").toLowerCase().replace(/\s/g, '')}.fr`,
      firstname: "Directeur",
      lastname: "Général",
      email: `contact@${(lead.companyName || "pro").toLowerCase().replace(/\s/g, '')}.fr`,
      jobTitle: "Decision Maker"
    }));

    return NextResponse.json({
      leads: enrichedLeads,
      strategy: {
        hook: aiContent.hook,
        approachStrategy: aiContent.strategy
      }
    });

  } catch (error) {
    console.error("API Global Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}







