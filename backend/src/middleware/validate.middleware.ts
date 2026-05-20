import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError.js";

type RequestSource = "body" | "query" | "params";

export function validate(schema: ZodSchema, source: RequestSource = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "root";
        if (!errors[key]) errors[key] = [];
        errors[key].push(issue.message);
      }
      return next(ApiError.badRequest("Validation failed", errors));
    }

    req[source] = result.data;
    next();
  };
}
