import { Router } from "express";
import { UserRole } from "@prisma/client";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { requirePermission } from "../middleware/rbac.middleware.js";
import {
  updateAdminProfileSchema,
  updateInternProfileSchema,
} from "../validators/user.validator.js";

const router = Router();

router.use(authenticate);

// Update profile - role-based access
router.patch(
  "/profile",
  (req, res, next) => {
    const schema =
      req.user?.role === UserRole.INTERN ? updateInternProfileSchema : updateAdminProfileSchema;
    return validate(schema)(req, res, next);
  },
  requirePermission("UPDATE_OWN_PROFILE"),
  userController.updateProfile,
);

// Get own profile
router.get("/profile", requirePermission("VIEW_OWN_PROFILE"), userController.getProfile);

// Directory list for chat (Admins and Interns)
router.get("/directory", userController.getChatDirectory);

// Admin-only: Get all users
router.get("/", requirePermission("VIEW_ALL_INTERNS"), userController.getAllUsers);

// Admin-only: Get admin dashboard stats
router.get(
  "/admin/dashboard-stats",
  requirePermission("VIEW_ALL_INTERNS"),
  userController.getAdminDashboardStats,
);

// Admin-only: Get user by ID
router.get("/:userId", requirePermission("VIEW_ALL_INTERNS"), userController.getUserById);

// Admin-only: Reset a user's password
router.post("/:userId/reset-password", requirePermission("VIEW_ALL_INTERNS"), userController.adminResetPassword);

// Admin-only: Delete a user
router.delete("/:userId", requirePermission("VIEW_ALL_INTERNS"), userController.adminDeleteUser);

export default router;
