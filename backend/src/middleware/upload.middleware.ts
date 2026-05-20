import fs from "fs";
import path from "path";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { env, maxFileSizeBytes } from "../config/env.js";
import { getUploadPath } from "../utils/file.js";
import { ApiError } from "../utils/ApiError.js"; // used in handleMulterError

const RESUME_MIMES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const IMAGE_MIMES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function diskStorage(subfolder: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = getUploadPath(subfolder);
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, unique);
    },
  });
}

function fileFilter(allowedMimes: Set<string>, allowedExts: string[]) {
  return (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimes.has(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.originalname}`));
    }
  };
}

const baseLimits = { fileSize: maxFileSizeBytes };

export const uploadResume = multer({
  storage: diskStorage("resumes"),
  limits: baseLimits,
  fileFilter: fileFilter(RESUME_MIMES, [".pdf", ".docx"]),
});

export const uploadProfilePhoto = multer({
  storage: diskStorage("photos"),
  limits: baseLimits,
  fileFilter: fileFilter(IMAGE_MIMES, [".jpg", ".jpeg", ".png", ".webp"]),
});

export const uploadInternRegistration = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const folder = _file.fieldname === "resume" ? "resumes" : "photos";
      const dir = getUploadPath(folder);
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, unique);
    },
  }),
  limits: baseLimits,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "resume") {
      return fileFilter(RESUME_MIMES, [".pdf", ".docx"])(req, file, cb);
    }
    if (file.fieldname === "profilePhoto") {
      return fileFilter(IMAGE_MIMES, [".jpg", ".jpeg", ".png", ".webp"])(req, file, cb);
    }
    cb(new Error(`Unexpected field: ${file.fieldname}`));
  },
});

export function handleMulterError(err: unknown, _req: Request, _res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(ApiError.badRequest(`File too large. Max ${env.MAX_FILE_SIZE_MB}MB allowed`));
    }
    return next(ApiError.badRequest(err.message));
  }

  if (err instanceof Error) {
    return next(ApiError.badRequest(err.message));
  }

  next(err);
}
