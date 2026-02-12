"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import ResultCard from "./ResultCard";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function IngredientRecognition() {
  const [text, setText] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function parseIngredientsFromAssistantText(raw: string): string[] {
    if (!raw) return [];

    const jsonArrayMatch = raw.match(/\[[\s\S]*?\]/);
    if (jsonArrayMatch) {
      try {
        const parsed = JSON.parse(jsonArrayMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed.map((x) => String(x).trim()).filter(Boolean);
        }
      } catch {}
    }

    return raw
      .split(/\n|,|•|- /g)
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !/^identified ingredients$/i.test(s));
  }

  async function onGenerate() {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg("");
    setIngredients([]);

    const userMessage: Message = { role: "user", content: text.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    try {
      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to get response");
      }

      const data = await res.json();
      const assistantText: string = data?.message ?? "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantText },
      ]);

      const list = parseIngredientsFromAssistantText(assistantText);

      if (!list.length) {
        setErrorMsg(
          "I can not find ingredients, please write different dish name",
        );
      }

      setIngredients(list);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="rounded-xl border p-5 shadow-sm text-black">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <div className="text-sm font-semibold">Ingredient recognition</div>
        </div>

        <textarea
          className="mt-4 w-full rounded-lg border p-2"
          placeholder="Please write food name... EX: Buuz, pizza etc ..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />

        <div className="mt-3 text-right">
          <button
            onClick={onGenerate}
            disabled={!text.trim() || isLoading}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 text-sm text-red-600">{errorMsg}</div>
        )}
      </div>

      <ResultCard title="Identified Ingredients">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Thinking...</div>
        ) : ingredients.length === 0 ? (
          <div className="text-sm text-muted-foreground">No results yet.</div>
        ) : (
          <ul className="list-disc pl-5">
            {ingredients.map((i, idx) => (
              <li key={`${i}-${idx}`}>{i}</li>
            ))}
          </ul>
        )}
      </ResultCard>
    </div>
  );
}
