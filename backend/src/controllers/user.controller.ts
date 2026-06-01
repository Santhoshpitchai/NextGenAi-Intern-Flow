import type { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import * as userService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { ApiError } from "../utils/ApiError.js";
import type {
  UpdateAdminProfileInput,
  UpdateInternProfileInput,
} from "../validators/user.validator.js";

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.user!;

  if (role !== UserRole.INTERN && role !== UserRole.COMPANY_ADMIN) {
    throw ApiError.forbidden();
  }

  const user = await userService.updateProfile(
    req.user!.id,
    role,
    req.body as UpdateInternProfileInput | UpdateAdminProfileInput,
  );

  sendSuccess(res, 200, "Profile updated successfully", user);
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user!.id);
  sendSuccess(res, 200, "Profile retrieved successfully", user);
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, page = "1", limit = "10" } = req.query;

  const users = await userService.getAllUsers({
    role: typeof role === "string" ? (role as UserRole) : undefined,
    page: parseInt(typeof page === "string" ? page : "1", 10),
    limit: parseInt(typeof limit === "string" ? limit : "10", 10),
  });

  sendSuccess(res, 200, "Users retrieved successfully", users);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const id = typeof userId === "string" ? userId : userId[0];
  const user = await userService.getUserById(id);
  sendSuccess(res, 200, "User retrieved successfully", user);
});

export const getAdminDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await userService.getAdminDashboardStats();
  sendSuccess(res, 200, "Admin dashboard stats retrieved successfully", stats);
});

export const getChatDirectory = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.getChatDirectory();
  sendSuccess(res, 200, "Chat directory retrieved successfully", users);
});
