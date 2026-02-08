import { NextResponse } from "next/server";
import path from "path";

// 1. On force l'importation Node.js classique pour DuckDB
const duckdb = require('duckdb');

export async function POST(req: Request) {
  try {
    const { industry, location, objective, bio } = await req.json();
    
    // Initialisation de la base de données
    const db = new duckdb.Database(":memory:");
    const parquetPath = path.join(process.cwd(), "sirene.parquet");

    // 2. Recherche dans le fichier SIRENE
    // On utilise une Promise pour que Next.js attende bien le résultat de DuckDB
    const rows: any[] = await new Promise((resolve, reject) => {
      const query = `
        SELECT name, section_activite, ville 
        FROM '${parquetPath}' 
        WHERE section_activite ILIKE '%${industry || ""}%' 
        AND ville ILIKE '%${location || ""}%'
        LIMIT 5
      `;
      
      db.all(query, (err: any, res: any) => {
        if (err) {
          console.error("Erreur DuckDB détaillée:", err);
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    // Si aucune donnée n'est trouvée, on s'arrête là proprement
    if (!rows || rows.length === 0) {
      return NextResponse.json({ 
        leads: [], 
        strategy: { hook: "Aucune entreprise trouvée pour cette recherche.", approachStrategy: "Essayez de modifier l'industrie ou la ville.", bestChannel: "N/A" } 
      });
    }

    // 3. Appel OpenRouter (IA)
    const openRouterKey = "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";
    
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "LD-LEADS Intelligence",
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-001",
        "messages": [
          {
            "role": "system",
            "content": "Tu es l'expert en prospection B2B de LD-LEADS. Ton but est de créer une stratégie d'approche basée sur une Bio et un Objectif. Réponds UNIQUEMENT avec un objet JSON."
          },
          {
            "role": "user",
            "content": `BIO: ${bio} | OBJECTIF: ${objective} | CIBLES TROUVÉES: ${rows.map(r => r.name).join(", ")}. 
            Génère un JSON avec exactement ces clés : "hook", "approachStrategy", "bestChannel". Réponds en Français.`
          }
        ]
      })
    });

    const aiData = await aiResponse.json();
    let strategy = { hook: "Erreur IA", approachStrategy: "L'IA n'a pas pu répondre.", bestChannel: "LinkedIn" };

    if (aiData.choices && aiData.choices[0]) {
      try {
        const cleanContent = aiData.choices[0].message.content.replace(/```json|```/g, "").trim();
        strategy = JSON.parse(cleanContent);
      } catch (e) {
        console.error("Erreur de lecture du JSON de l'IA:", e);
      }
    }

    // 4. On formate les résultats pour le Dashboard
    const leads = rows.map((row) => ({
      companyName: row.name || "Société Inconnue",
      companyWebsite: row.name ? `www.${row.name.toLowerCase().replace(/\s+/g, '')}.fr` : "#",
      firstName: "Responsable",
      lastName: "Décideur",
      jobTitle: row.section_activite || industry,
      email: row.name ? `contact@${row.name.toLowerCase().replace(/\s+/g, '')}.fr` : "contact@prospect.fr",
      profileUrl: "#"
    }));

    return NextResponse.json({ leads, strategy });

  } catch (error: any) {
    console.error("ERREUR CRITIQUE ROUTE API:", error);
    return NextResponse.json({ 
      leads: [], 
      strategy: null,
      error: error.message 
    }, { status: 500 });
  }
}







