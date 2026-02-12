"use client";

import { useState } from "react";
import Tabs from "./Tabs";
import { ToolShell } from "./ToolShell";
import type { TabItem, TabKey } from "./types";
import ImageAnalysis from "./ImageAnalysis";
import IngredientRecognition from "./IngredientRecognition";
import ImageCreator from "./ImageCreator";

const items: TabItem[] = [
  { key: "image-analysis", label: "Image analysis" },
  { key: "ingredient-recognition", label: "Ingredient recognition" },
  { key: "image-creator", label: "Image creator" },
];

export default function AiToolsPage() {
  const [tab, setTab] = useState<TabKey>("image-analysis");

  return (
    <ToolShell>
      <div className="flex justify-center">
        <Tabs items={items} value={tab} onChange={setTab} />
      </div>

      <div className="mt-6">
        {tab === "image-analysis" && <ImageAnalysis />}
        {tab === "ingredient-recognition" && <IngredientRecognition />}
        {tab === "image-creator" && <ImageCreator />}
      </div>
    </ToolShell>
  );
}
