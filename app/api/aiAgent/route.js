


import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const text = body.text;

    const user=body.user
    const userEmail=user.email
    const userId=user._id


    if (!text) {
      return new Response(JSON.stringify({ message: "No audio URL provided" }), { status: 400 });
    }

    const openRouterResponse = await callOpenRouterAPI(text);

    return new Response(JSON.stringify({ text: openRouterResponse }), { status: 200 });
  } catch (error) {
    console.error("Error processing AI agent request:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}



async function callOpenRouterAPI(userQuery) {
  const OPENROUTER_API_KEY = `${process.env.aiAgent}`; // store securely in .env

  const OPENROUTER_API_URL = "https://api.together.xyz/v1/chat/completions";

  if (!OPENROUTER_API_KEY) throw new Error("OpenRouter API key not configured");

  const response = await axios.post(
    OPENROUTER_API_URL,
    {
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: userQuery }
      ],
      max_tokens: 50,
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0]?.message?.content || "No AI response.";
}
