import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import type {
  RegisterAdminInput,
  RegisterInternInput,
  LoginInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ResendVerificationInput,
} from "../validators/auth.validator.js";

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

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.changePassword(req.user!.id, req.body as ChangePasswordInput);
  sendSuccess(res, 200, "Password changed successfully", null);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, role } = req.body as ForgotPasswordInput;
  await authService.forgotPassword(email, role);
  // Always return success even if email not found to prevent enumeration
  sendSuccess(
    res,
    200,
    "If an account exists with that email and role, a password reset link has been sent.",
    null,
  );
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body as ResetPasswordInput;
  await authService.resetPassword(token, newPassword);
  sendSuccess(
    res,
    200,
    "Password reset successfully. You can now login with your new password.",
    null,
  );
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body as VerifyEmailInput;
  await authService.verifyEmail(token);
  sendSuccess(res, 200, "Email verified successfully.", null);
});

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ResendVerificationInput;
  await authService.resendVerificationEmail(email);
  sendSuccess(res, 200, "Verification email resent successfully.", null);
});
