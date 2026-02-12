import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type Role = "user" | "assistant";
interface Message {
  role: Role;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const messages: Message[] = Array.isArray(body?.messages)
      ? body.messages
      : [];

    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const systemInstruction =
      "You are a helpful assistant specializing in ingredients. " +
      'Return ONLY a JSON array of ingredient strings, like ["tomato","onion"]. ' +
      "No extra text, no markdown.";

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents:
        contents.length > 0
          ? contents
          : [{ role: "user", parts: [{ text: "[]" }] }],
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const assistantMessage = response.text?.trim() || "[]";

    return NextResponse.json({ message: assistantMessage });
  } catch (error: any) {
    console.error("Error in /api/chat:", error?.message || error);

    return NextResponse.json(
      {
        error: "Internal server error",
        detail: String(error?.message || error),
      },
      { status: 500 },
    );
  }
}
