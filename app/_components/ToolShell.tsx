export function ToolShell({
  title = "AI tools",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-6 py-10 ">
        <div className=" font-semibold py-5 border-b-2 text-xl text-black pl-12">
          {title}
        </div>

        <div className="mt-10">
          <div className="mx-auto max-w-xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
