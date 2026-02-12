import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey)
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );

    const ai = new GoogleGenAI({ apiKey });

    const history = messages.slice(0, -1).map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history,
      config: {
        systemInstruction:
          "You are a helpful AI assistant specializing in food, recipes, and ingredients. Provide concise, friendly responses.",
      },
    });

    const response = await chat.sendMessage({
      message: lastMessage.content,
    });

    console.log("Response", response);

    const assistantMessage =
      response.text || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Error in chat API:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
