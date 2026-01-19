import { NextResponse } from "next/server";

// 🛠️ CONFIGURATION : 
// true = Mode Test (Gratuit, résultats simulés)
// false = Mode Réel (Utilise OpenRouter + Claude 3.5)
const IS_TEST_MODE = true; 

export async function POST(req: Request) {
  try {
    const { profile, objective, industry, location } = await req.json();

    // --- LOG DE DÉBOGAGE DANS LE TERMINAL ---
    console.log("--- NEW SCAN REQUEST ---");
    console.log(`Target: ${industry} in ${location}`);
    console.log("Mode:", IS_TEST_MODE ? "TEST 🧪" : "REAL 🚀");

    if (IS_TEST_MODE) {
      // 🟢 MODE TEST : Retourne des données instantanées sans appeler l'IA
      // Utile pour tester ton interface, GitHub et Vercel gratuitement
      return NextResponse.json({
        strategy: `[TEST MODE] To dominate the ${industry} market in ${location}, you should leverage your profile to build authority. We recommend a 3-step LinkedIn sequence followed by a direct value-based email to the CEOs listed below. This strategy is optimized for your objective: "${objective}".`,
        leads: Array(15).fill(null).map((_, i) => ({
          company: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Group ${i + 1}`,
          ceo: `Executive Director ${i + 1}`,
          title: "Decision Maker",
          website: `www.${industry.toLowerCase().replace(/\s+/g, '-')}-algeria.dz`,
          email: `contact@entity-${i+1}.dz`
        }))
      });
    }

    // 🔵 MODE RÉEL : Appel à OpenRouter (Claude 3.5 Sonnet)
    // Vérification de la clé API
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("Missing OPENROUTER_API_KEY in .env.local");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
      },
      body: JSON.stringify({
        "model": "anthropic/claude-3.5-sonnet",
        "messages": [
          {
            "role": "system",
            "content": "You are a professional B2B lead generation expert. You provide REAL companies and REAL names. Response must be strict JSON."
          },
          {
            "role": "user",
            "content": `Find 15 real companies in ${location} within the ${industry} sector. 
            Include CEO name, job title, and website.
            Context: My Profile: ${profile}, My Objective: ${objective}.
            
            JSON FORMAT REQUIRED:
            {
              "strategy": "3 paragraphs strategy in English...",
              "leads": [
                {"company": "...", "ceo": "...", "title": "...", "website": "...", "email": "..."}
              ]
            }`
          }
        ],
        "response_format": { "type": "json_object" }
      })
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const content = data.choices[0].message.content;
    return NextResponse.json(JSON.parse(content));

  } catch (error) {
    console.error("CRITICAL ERROR:", error);
    return NextResponse.json({ error: "Check server terminal for details" }, { status: 500 });
  }
}

