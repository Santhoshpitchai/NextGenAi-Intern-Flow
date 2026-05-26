import { Router } from "express";
import { UserRole } from "@prisma/client";
import * as uploadController from "../controllers/upload.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/rbac.middleware.js";
import {
  uploadResume as resumeMiddleware,
  uploadProfilePhoto as photoMiddleware,
  handleMulterError,
} from "../middleware/upload.middleware.js";

const router = Router();

router.use(authenticate, authorize(UserRole.INTERN));

router.post(
  "/resume",
  requirePermission("UPLOAD_RESUME"),
  resumeMiddleware.single("resume"),
  handleMulterError,
  uploadController.uploadResume,
);

router.post(
  "/profile-photo",
  requirePermission("UPLOAD_PROFILE_PHOTO"),
  photoMiddleware.single("profilePhoto"),
  handleMulterError,
  uploadController.uploadProfilePhoto,
);

export default router;
