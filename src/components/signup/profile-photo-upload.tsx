import { useEffect, useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface ProfilePhotoUploadProps {
  id: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export function ProfilePhotoUpload({
  id,
  value,
  onChange,
  error,
  disabled,
}: ProfilePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  return (
    <div>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Profile Photo
      </Label>
      <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, or WEBP — up to 5MB</p>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          onChange(file ?? null);
        }}
      />

      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div
          className={cn(
            "relative size-24 overflow-hidden rounded-2xl border-2 shadow-soft transition-all",
            previewUrl ? "border-primary/30" : "border-dashed border-border bg-muted/30",
            error && "border-destructive",
          )}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Profile preview" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center bg-gradient-primary text-primary-foreground">
              <Camera className="size-8" />
            </div>
          )}
          {previewUrl && !disabled && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
              aria-label="Remove photo"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="size-4" />
            {previewUrl ? "Change photo" : "Upload photo"}
          </Button>
          {value && (
            <p className="max-w-[200px] truncate text-xs text-muted-foreground">{value.name}</p>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-center text-[0.8rem] font-medium text-destructive sm:text-left" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
