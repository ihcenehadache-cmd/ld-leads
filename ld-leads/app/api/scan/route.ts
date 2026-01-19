import { NextResponse } from "next/server";

// MODE TEST ACTIVÉ (Pas besoin de clé API valide pour le moment)
const IS_TEST_MODE = true; 

export async function POST(req: Request) {
  try {
    const { industry, location, objective } = await req.json();

    if (IS_TEST_MODE) {
      // Simule une pause de 1 seconde pour faire "réel"
      await new Promise(resolve => setTimeout(resolve, 1000));

      return NextResponse.json({
        strategy: `Test Strategy for ${industry} in ${location}. Focus on local SEO and B2B outreach via LinkedIn to achieve your goal: ${objective}.`,
        leads: Array(15).fill(null).map((_, i) => ({
          company: `${industry} Solutions ${i + 1}`,
          ceo: `Name ${i + 1}`,
          title: "Decision Maker",
          website: `www.${industry.toLowerCase().replace(/\s+/g, '')}-test.dz`,
          email: `contact@test-${i+1}.dz`
        }))
      });
    }

    // Bloc API Réel (sera ignoré car IS_TEST_MODE = true)
    return NextResponse.json({ error: "Real mode not active" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

