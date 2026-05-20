import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import type { RegisterAdminInput, RegisterInternInput, LoginInput } from "../validators/auth.validator.js";

export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerCompanyAdmin(req.body as RegisterAdminInput);
  sendSuccess(res, 201, "Company admin registered successfully", result);
});

export const registerIntern = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const result = await authService.registerIntern(req.body as RegisterInternInput, {
    resume: files?.resume?.[0],
    profilePhoto: files?.profilePhoto?.[0],
  });
  sendSuccess(res, 201, "Intern registered successfully", result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body as LoginInput, {
    ip: req.ip,
    userAgent: req.get("user-agent") ?? undefined,
  });
  sendSuccess(res, 200, "Login successful", result);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  const tokens = await authService.refreshAccessToken(refreshToken);
  sendSuccess(res, 200, "Token refreshed", tokens);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  await authService.logout(refreshToken);
  sendSuccess(res, 200, "Logged out successfully", null);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);
  sendSuccess(res, 200, "Current user retrieved", user);
});
