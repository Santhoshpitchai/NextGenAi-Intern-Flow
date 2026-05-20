import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    { label, placeholder = "••••••••", error, className, id, disabled, ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false);

    return (
      <div className={className}>
        <Label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </Label>
        <div className="relative mt-1.5">
          <Lock className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={id}
            ref={ref}
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "h-11 bg-background/60 pl-10 pr-10",
              error && "border-destructive focus-visible:ring-destructive",
            )}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 z-10 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
        {error && (
          <p className="mt-1.5 text-[0.8rem] font-medium text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
