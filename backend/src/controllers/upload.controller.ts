import type { Request, Response } from "express";
import * as uploadService from "../services/upload.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { ApiError } from "../utils/ApiError.js";

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("Resume file is required");
  }

  const user = await uploadService.uploadResume(req.user!.id, req.file);
  sendSuccess(res, 200, "Resume uploaded successfully", user);
});

export const uploadProfilePhoto = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("Profile photo is required");
  }

  const user = await uploadService.uploadProfilePhoto(req.user!.id, req.file);
  sendSuccess(res, 200, "Profile photo uploaded successfully", user);
});
