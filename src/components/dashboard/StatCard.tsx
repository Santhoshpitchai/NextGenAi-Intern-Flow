import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  trend = "up",
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  tone?: "primary" | "secondary" | "success" | "warning";
}) {
  const tones: Record<string, string> = {
    primary: "from-primary/15 to-primary/0 text-primary",
    secondary: "from-secondary/15 to-secondary/0 text-secondary",
    success: "from-success/15 to-success/0 text-success",
    warning: "from-warning/15 to-warning/0 text-warning",
  };
  return (
    <div className="p-5 rounded-2xl glass shadow-soft">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "size-10 rounded-xl grid place-items-center bg-gradient-to-br",
            tones[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
        {delta && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {trend === "up" ? "↑" : "↓"} {delta}
          </span>
        )}
      </div>
      <div className="mt-4 text-3xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
