import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { answers } = await request.json();

    if (!answers || !Array.isArray(answers) || answers.length < 3) {
      return Response.json({ error: "Missing required onboarding answers" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert dating profile biographer for "Dizluv", a platform for deep connections.
      Based on the following 3 answers from a user's onboarding questionnaire, generate a compelling, witty, and authentic narrative bio (max 3 sentences).
      The tone should be warm, slightly mysterious, and inviting.
      
      User Answers:
      1. What's your ideal Sunday? ${answers[0]}
      2. If you could have dinner with anyone, who? ${answers[1]}
      3. What's one thing you're passionate about? ${answers[2]}
      
      Return ONLY the narrative bio text.
    `;

    const result = await model.generateContent(prompt);
    const bio = result.response.text().trim();

    return Response.json({ bio });
  } catch (error: any) {
    console.error("Bio Generation Error:", error);
    return Response.json({ error: "Failed to generate bio" }, { status: 500 });
  }
}
