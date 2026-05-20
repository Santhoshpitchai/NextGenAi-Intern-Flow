import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export const FormInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  function FormInput(
    {
      label,
      icon: Icon,
      type = "text",
      placeholder,
      error,
      className,
      multiline = false,
      rows = 3,
      id,
      ...props
    },
    ref,
  ) {
    const inputClassName = cn(
      "h-11 bg-background/60",
      Icon && "pl-10",
      error && "border-destructive focus-visible:ring-destructive",
    );

    return (
      <div className={className}>
        <Label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </Label>
        <div className="relative mt-1.5">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
          )}
          {multiline ? (
            <Textarea
              id={id}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              placeholder={placeholder}
              rows={rows}
              className={cn(
                "min-h-[88px] resize-none bg-background/60",
                Icon && "pl-10",
                error && "border-destructive focus-visible:ring-destructive",
              )}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <Input
              id={id}
              ref={ref as React.Ref<HTMLInputElement>}
              type={type}
              placeholder={placeholder}
              className={inputClassName}
              {...props}
            />
          )}
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
