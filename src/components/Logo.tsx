import { cn } from "@/lib/utils";

export function Logo({ className, size = "md", variant = "default" }: { className?: string; size?: "sm" | "md" | "lg"; variant?: "default" | "light" }) {
  const dim = size === "sm" ? "size-7" : size === "lg" ? "size-10" : "size-8";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  const isLight = variant === "light";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(dim, "rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground font-bold shadow-glow")}>
        <svg viewBox="0 0 24 24" className="w-1/2 h-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
          <path d="M14 17h6M17 14v6" />
        </svg>
      </div>
      <a
        href="https://www.nextgenaiautomation.net/"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          text,
          "font-bold tracking-tight transition-colors cursor-pointer",
          isLight ? "text-white hover:text-cyan-300" : "text-foreground hover:text-primary"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        InternFlow <span className={isLight ? "text-cyan-400" : "text-primary"}>AI</span>
      </a>
    </div>
  );
}
