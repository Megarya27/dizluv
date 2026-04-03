import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "No messages provided for analysis" }, { status: 400 });
    }

    const lastMessages = messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI "Wingman" for the dating app "Dizluv".
      Your goal is to help two people maintain a meaningful conversation.
      Analyze the last 5 messages from their chat and provide 3 short, contextual, and engaging conversation starters (max 15 words each).
      Keep the tone lighthearted, curious, and supportive.
      
      Last 5 messages:
      ${lastMessages}
      
      Return the 3 starters as a JSON array of strings ONLY.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON array from response
    const starters = JSON.parse(responseText.substring(responseText.indexOf('['), responseText.lastIndexOf(']') + 1));

    return Response.json({ starters });
  } catch (error: any) {
    console.error("Wingman Error:", error);
    return Response.json({ error: "Failed to generate hints" }, { status: 500 });
  }
}
