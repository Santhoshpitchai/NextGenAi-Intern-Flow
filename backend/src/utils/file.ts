import path from "path";
import { env } from "../config/env.js";

export function getUploadPath(...segments: string[]): string {
  return path.join(process.cwd(), env.UPLOAD_DIR, ...segments);
}

export function toPublicFileUrl(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/");
  return `/uploads/${normalized}`;
}

export function parseOptionalUrl(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return String(value);
}
