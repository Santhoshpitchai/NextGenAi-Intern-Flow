import { useRef } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  id: string;
  label: string;
  description?: string;
  accept: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  id,
  label,
  description,
  accept,
  value,
  onChange,
  error,
  className,
  disabled,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    onChange(file ?? null);
  };

  return (
    <div className={className}>
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </Label>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          handleFile(file);
        }}
      />

      <div
        className={cn(
          "mt-2 flex flex-col gap-3 rounded-xl border border-dashed border-border/80 bg-background/40 p-4 transition-colors sm:flex-row sm:items-center",
          error && "border-destructive/60",
          !disabled && "hover:border-primary/40 hover:bg-background/60",
        )}
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          {value ? <FileText className="size-5" /> : <Upload className="size-5" />}
        </div>

        <div className="min-w-0 flex-1">
          {value ? (
            <>
              <p className="truncate text-sm font-medium">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {(value.size / 1024).toFixed(1)} KB
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Drag & drop or click to browse</p>
          )}
        </div>

        <div className="flex gap-2 sm:shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            {value ? "Replace" : "Browse"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={disabled}
              onClick={() => {
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              aria-label="Remove file"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-[0.8rem] font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
