import { Router } from "express";
import { UserRole } from "@prisma/client";
import * as uploadController from "../controllers/upload.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/rbac.middleware.js";
import {
  uploadResume as resumeMiddleware,
  uploadProfilePhoto as photoMiddleware,
  uploadAttachment as attachmentMiddleware,
  handleMulterError,
} from "../middleware/upload.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/resume",
  authorize(UserRole.INTERN),
  requirePermission("UPLOAD_RESUME"),
  resumeMiddleware.single("resume"),
  handleMulterError,
  uploadController.uploadResume,
);

router.post(
  "/profile-photo",
  authorize(UserRole.INTERN),
  requirePermission("UPLOAD_PROFILE_PHOTO"),
  photoMiddleware.single("profilePhoto"),
  handleMulterError,
  uploadController.uploadProfilePhoto,
);

router.post(
  "/attachment",
  authorize(UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN),
  attachmentMiddleware.single("attachment"),
  handleMulterError,
  uploadController.uploadAttachment,
);

export default router;
