"use client";

import type { TabItem, TabKey } from "./types";

type Props = {
  items: TabItem[];
  value: TabKey;
  onChange: (key: TabKey) => void;
};

export default function Tabs({ items, value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1 shadow-sm">
      {items.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium transition",
              active
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
