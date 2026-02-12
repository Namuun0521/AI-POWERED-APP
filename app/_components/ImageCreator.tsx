// "use client";

// import { useState } from "react";
// import { Sparkles } from "lucide-react";
// import ResultCard from "./ResultCard";

// export default function ImageCreator() {
//   const [prompt, setPrompt] = useState("");
//   const [result, setResult] = useState("");

//   function onGenerate() {
//     if (!prompt) return;
//     setResult("https://placehold.co/600x400");
//   }

//   return (
//     <div>
//       <div className="rounded-xl border p-5 shadow-sm text-black">
//         <div className="flex items-center gap-2">
//           <Sparkles className="h-4 w-4" />
//           <div className="text-sm font-semibold">Food image creator</div>
//         </div>

//         <textarea
//           className="mt-4 w-full rounded-lg border p-2"
//           placeholder="Хоолны тайлбар"
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//         />

//         <div className="mt-3 text-right">
//           <button
//             onClick={onGenerate}
//             className="rounded-lg bg-black px-4 py-2 text-sm text-white"
//           >
//             Generate
//           </button>
//         </div>
//       </div>

//       <ResultCard title="Result" variant="image">
//         {result && <img src={result} alt="result" className="rounded-lg" />}
//       </ResultCard>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Sparkles, RotateCw } from "lucide-react";
import ResultCard from "./ResultCard";

export default function ImageCreator() {
  const [prompt, setPrompt] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // өмнөх blob URL-аа цэвэрлэх
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  async function onGenerate() {
    const p = prompt.trim();
    if (!p || loading) return;

    setLoading(true);
    setError(null);

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to generate image");
      }

      const blob = await res.blob(); // image/png stream
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Error generating image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="rounded-xl border p-5 shadow-sm text-black">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <div className="text-sm font-semibold">Food image creator</div>
        </div>

        <textarea
          className="mt-4 w-full rounded-lg border p-2"
          placeholder="Please write dish name. Example: Pizza"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="mt-3 text-right">
          <button
            onClick={onGenerate}
            disabled={!prompt.trim() || loading}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:bg-zinc-300"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <RotateCw className="h-4 w-4 animate-spin" />
                Generating...
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </div>

      <ResultCard
        title="Result"
        variant="image"
        subtitle={
          error
            ? error
            : resultUrl
              ? "Generated image."
              : "Generated food photo"
        }
      >
        {resultUrl ? (
          <img src={resultUrl} alt="result" className="w-full rounded-lg" />
        ) : null}
      </ResultCard>
    </div>
  );
}
