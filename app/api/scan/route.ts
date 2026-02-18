import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { industry, location, bio, objective } = await req.json();

    // 1. Initialize model with Google Search Grounding
    // Using 'as any' to bypass the temporary TypeScript definition lag for googleSearch
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} } as any],
    });

    // 2. Craft the Advanced Prompt
    const prompt = `
      Perform a live Google Search to find 10 REAL, ACTIVE companies matching this criteria:
      Industry: ${industry}
      Location: ${location}
      
      User Bio: ${bio}
      User Objective: ${objective}

      OUTPUT INSTRUCTIONS:
      Return ONLY a JSON object. No markdown, no intro, no comments.
      
      {
        "leads": [
          {
            "companyName": "Exact Company Name",
            "website": "www.company.com",
            "industry": "${industry}",
            "city": "City Name",
            "country": "FR", // MUST BE A 2-LETTER ISO CODE (e.g., FR, US, GB, DZ)
            "status": "READY"
          }
        ],
        "strategy": {
          "hook": "A short, punchy opening line for an email based on the user's bio.",
          "approachStrategy": "A 2-sentence plan on how to close these leads based on the objective."
        }
      }
    `;

    // 3. Execute the Search
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // 4. Clean and Parse JSON (removes markdown code blocks if the AI adds them)
    const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Advanced AI Search Error:", error);
    return NextResponse.json({ error: "Failed to fetch live data from search." }, { status: 500 });
  }
}