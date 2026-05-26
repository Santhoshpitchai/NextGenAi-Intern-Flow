import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TermsModal, PrivacyModal } from "@/components/auth/terms-modal";

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
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setShowTerms(true);
            }}
            className="font-medium text-primary hover:underline cursor-pointer bg-transparent border-none p-0 inline-block align-baseline"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setShowPrivacy(true);
            }}
            className="font-medium text-primary hover:underline cursor-pointer bg-transparent border-none p-0 inline-block align-baseline"
          >
            Privacy Policy
          </button>
          .
        </Label>
      </div>
      {error && (
        <p className="text-[0.8rem] font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Terms and Privacy Policy Modals */}
      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
      <PrivacyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
    </div>
  );
}
