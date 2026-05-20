import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface TermsCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function TermsCheckbox({
  id,
  checked,
  onCheckedChange,
  error,
  disabled,
  className,
}: TermsCheckboxProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start gap-2.5">
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(v) => onCheckedChange(v === true)}
          className="mt-0.5"
        />
        <Label htmlFor={id} className="cursor-pointer text-sm font-normal leading-relaxed text-muted-foreground">
          I agree to the{" "}
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="font-medium text-primary hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="font-medium text-primary hover:underline"
          >
            Privacy Policy
          </a>
          .
        </Label>
      </div>
      {error && (
        <p className="text-[0.8rem] font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
