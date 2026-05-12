import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "size-7" : size === "lg" ? "size-10" : "size-8";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(dim, "rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground font-bold shadow-glow")}>
        <svg viewBox="0 0 24 24" className="w-1/2 h-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
          <path d="M14 17h6M17 14v6" />
        </svg>
      </div>
      <span className={cn(text, "font-bold tracking-tight")}>
        InternFlow <span className="text-primary">AI</span>
      </span>
    </div>
  );
}
