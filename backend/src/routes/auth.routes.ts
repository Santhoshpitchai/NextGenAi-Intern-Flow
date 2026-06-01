import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  registerAdminSchema,
  registerInternSchema,
  loginSchema,
  logoutSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../validators/auth.validator.js";
import { uploadInternRegistration, handleMulterError } from "../middleware/upload.middleware.js";
import { authLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post(
  "/register/admin",
  authLimiter,
  validate(registerAdminSchema),
  authController.registerAdmin,
);

router.post(
  "/register/intern",
  authLimiter,
  uploadInternRegistration.fields([
    { name: "resume", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
  ]),
  handleMulterError,
  validate(registerInternSchema),
  authController.registerIntern,
);

router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh", validate(logoutSchema), authController.refresh);
router.post("/logout", validate(logoutSchema), authController.logout);
router.get("/me", authenticate, authController.getMe);
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword,
);
router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

router.post(
  "/verify-email",
  authLimiter,
  validate(verifyEmailSchema),
  authController.verifyEmail,
);

router.post(
  "/resend-verification",
  authLimiter,
  validate(resendVerificationSchema),
  authController.resendVerification,
);

export default router;
