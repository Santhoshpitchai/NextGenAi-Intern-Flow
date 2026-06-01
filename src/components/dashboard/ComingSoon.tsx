import { PageHeader } from "./PageHeader";
import { Sparkles } from "lucide-react";

export function ComingSoon({
  title,
  subtitle,
  hint,
}: {
  title: string;
  subtitle?: string;
  hint?: string;
}) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="rounded-3xl glass shadow-soft p-16 text-center">
        <div className="size-14 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center mx-auto shadow-glow">
          <Sparkles className="size-6" />
        </div>
        <h3 className="mt-6 text-xl font-bold">Module ready to wire up</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm">
          {hint ??
            "This screen is part of the design system. Connect it to your backend to enable live data."}
        </p>
      </div>
    </div>
  );
}
