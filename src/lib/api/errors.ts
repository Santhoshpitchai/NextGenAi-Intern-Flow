import type { ApiErrorBody } from "@/types/auth";

export class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }

  static fromResponse(status: number, body: ApiErrorBody): ApiRequestError {
    return new ApiRequestError(status, body.message, body.errors);
  }

  getFieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0];
  }

  getAllFieldErrors(): string[] {
    if (!this.errors) return [];
    return Object.values(this.errors).flat();
  }
}
