import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { sendError } from "../utils/response.js";
import { env } from "../config/env.js";

export function notFoundHandler(_req: Request, res: Response) {
  return sendError(res, 404, "Route not found");
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message, err.errors);
  }

  if (err instanceof Error && err.name === "JsonWebTokenError") {
    return sendError(res, 401, "Invalid token");
  }

  if (err instanceof Error && err.name === "TokenExpiredError") {
    return sendError(res, 401, "Token expired");
  }

  if (err instanceof Error && err.message.includes("Invalid file type")) {
    return sendError(res, 400, err.message);
  }

  console.error("[Error]", err);

  const message =
    env.NODE_ENV === "production" ? "Internal server error" : (err as Error)?.message ?? "Unknown error";

  return sendError(res, 500, message);
}
