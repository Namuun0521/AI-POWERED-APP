"use client";

import { useRef, useState } from "react";
import { Sparkles, RotateCw } from "lucide-react";
import ResultCard from "./ResultCard";
import { pipeline } from "@huggingface/transformers";
import { Button } from "@/components/ui/button";

export default function ImageAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [summary, setsummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const captionerRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setsummary(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setsummary(null);
  };

  const handleGenerate = async () => {
    if (!imagePreview) return;

    setLoading(true);

    try {
      if (!captionerRef.current) {
        captionerRef.current = await pipeline(
          "image-classification",
          "onnx-community/mobilenet_v2_1.4_224-ONNX",
        );
      }

      const output = await captionerRef.current(imagePreview);

      console.log("Output", output);

      if (Array.isArray(output) && output.length > 0) {
        const top = output[0] as { label?: string; score?: number };

        const text = top?.label
          ? `${top.label}${
              typeof top.score === "number"
                ? ` (${(top.score * 100).toFixed(1)}%)`
                : ""
            }`
          : JSON.stringify(output, null, 2);

        setsummary(text);
      } else {
        setsummary("No result returned.");
      }
    } catch (error) {
      console.error("Error generating caption:", error);
      setsummary("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm text-black">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <div className="text-sm font-semibold">Image analysis</div>
        </div>

        <div className="mt-2 text-xs text-zinc-500">
          Upload a food photo, and AI will classify by the ingredients.
        </div>
        <div className="mt-4 flex gap-3">
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button
            onClick={handleGenerate}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:bg-zinc-300"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <RotateCw className="h-4 w-4 animate-spin" />
                {modelLoading ? "Loading model..." : "Generating..."}
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </div>

        {imagePreview ? (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="preview"
              className="w-full rounded-lg border border-zinc-200"
            />
          </div>
        ) : null}
      </div>

      <ResultCard
        title="Here is the summary"
        subtitle={summary ? "Generated caption." : "First, upload image."}
      >
        {summary}
      </ResultCard>
    </div>
  );
}
