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
