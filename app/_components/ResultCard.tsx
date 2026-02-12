import { FileText, Image as ImageIcon } from "lucide-react";

export default function ResultCard({
  title,
  subtitle,
  children,
  variant = "text",
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  variant?: "text" | "image";
}) {
  const Icon = variant === "image" ? ImageIcon : FileText;

  return (
    <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm text-black">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 text-zinc-700" />
        <div>
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          {subtitle && (
            <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
          )}
        </div>
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
