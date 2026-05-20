import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiRequestError } from "@/lib/api/errors";

export function applyApiFieldErrors<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
): err is ApiRequestError {
  if (!(err instanceof ApiRequestError) || !err.errors) {
    return err instanceof ApiRequestError;
  }

  for (const [field, messages] of Object.entries(err.errors)) {
    setError(field as Path<T>, { type: "server", message: messages[0] });
  }

  return true;
}
