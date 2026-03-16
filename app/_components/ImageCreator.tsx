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
// "use client";

// import { useEffect, useState } from "react";
// import { Sparkles, RotateCw } from "lucide-react";
// import ResultCard from "./ResultCard";

// export default function ImageCreator() {
//   const [prompt, setPrompt] = useState("");
//   const [resultUrl, setResultUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // өмнөх blob URL-аа цэвэрлэх
//   useEffect(() => {
//     return () => {
//       if (resultUrl) URL.revokeObjectURL(resultUrl);
//     };
//   }, [resultUrl]);

//   async function onGenerate() {
//     const p = prompt.trim();
//     if (!p || loading) return;

//     setLoading(true);
//     setError(null);

//     if (resultUrl) {
//       URL.revokeObjectURL(resultUrl);
//       setResultUrl(null);
//     }

//     try {
//       const res = await fetch("/api/generate-image", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: p }),
//       });

//       if (!res.ok) {
//         const text = await res.text().catch(() => "");
//         throw new Error(text || "Failed to generate image");
//       }

//       const blob = await res.blob(); // image/png stream
//       const url = URL.createObjectURL(blob);
//       setResultUrl(url);
//     } catch (e: any) {
//       console.error(e);
//       setError(e?.message ?? "Error generating image.");
//     } finally {
//       setLoading(false);
//     }
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
//           placeholder="Please write dish name. Example: Pizza"
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//         />

//         <div className="mt-3 text-right">
//           <button
//             onClick={onGenerate}
//             disabled={!prompt.trim() || loading}
//             className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:bg-zinc-300"
//           >
//             {loading ? (
//               <span className="inline-flex items-center gap-2">
//                 <RotateCw className="h-4 w-4 animate-spin" />
//                 Generating...
//               </span>
//             ) : (
//               "Generate"
//             )}
//           </button>
//         </div>
//       </div>

//       <ResultCard
//         title="Result"
//         variant="image"
//         subtitle={
//           error
//             ? error
//             : resultUrl
//               ? "Generated image."
//               : "Generated food photo"
//         }
//       >
//         {resultUrl ? (
//           <img src={resultUrl} alt="result" className="w-full rounded-lg" />
//         ) : null}
//       </ResultCard>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Sparkles, RotateCw, RefreshCw } from "lucide-react";
import ResultCard from "./ResultCard";

export default function ImageCreator() {
  const [prompt, setPrompt] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  async function generateImage() {
    const p = prompt.trim();
    if (!p || loading) return;

    setLoading(true);
    setError(null);

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }

    try {
      console.log("Generating food image for:", p);

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMessage = "Failed to generate image";

        if (contentType?.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          errorMessage = await res.text();
        }

        throw new Error(errorMessage);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      console.log("Image loaded successfully");
    } catch (e: any) {
      console.error("Error:", e);
      setError(e?.message ?? "Error generating image");
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    if (prompt) {
      generateImage();
    }
  }

  return (
    <div>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm text-black">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <div className="text-sm font-semibold">Food image creator</div>
        </div>

        <div className="mt-2 text-xs text-zinc-500">
          Enter food name to get real food images
        </div>

        <input
          type="text"
          className="mt-4 w-full rounded-lg border border-zinc-200 p-2 text-sm focus:border-zinc-400 focus:outline-none"
          placeholder="pizza, burger, sushi, pasta, ramen, cake..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              generateImage();
            }
          }}
          disabled={loading}
        />

        <div className="mt-3 flex items-center justify-end gap-2">
          {error && (
            <button
              onClick={handleRetry}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          )}
          <button
            onClick={generateImage}
            disabled={!prompt.trim() || loading}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:bg-zinc-300 disabled:cursor-not-allowed hover:bg-zinc-800"
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

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3">
            <div className="text-red-600 text-sm font-medium">⚠️ Error</div>
            <div className="mt-1 text-sm text-red-600">{error}</div>
          </div>
        )}
      </div>

      <ResultCard
        title="Food Image"
        variant="image"
        subtitle={
          error
            ? "Failed to load image"
            : resultUrl
              ? "Real food image from Unsplash"
              : "Enter food name above to generate"
        }
      >
        {resultUrl && (
          <img
            src={resultUrl}
            alt={prompt || "Food"}
            className="w-full rounded-lg"
          />
        )}
      </ResultCard>
    </div>
  );
}
