import { Router } from "express";
import * as assignmentController from "../controllers/assignment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/rbac.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createAssignmentSchema, updateAssignmentSchema } from "../validators/assignment.validator.js";

const router = Router();

router.use(authenticate);

// Admin routes
router.post(
  "/",
  requirePermission("CREATE_INTERN_ASSIGNMENT"),
  validate(createAssignmentSchema),
  assignmentController.createAssignment
);

router.get(
  "/",
  requirePermission("MANAGE_ASSIGNMENTS"),
  assignmentController.getAssignments
);

router.get(
  "/:id",
  assignmentController.getAssignmentById
);

router.patch(
  "/:id",
  requirePermission("MANAGE_ASSIGNMENTS"),
  validate(updateAssignmentSchema),
  assignmentController.updateAssignment
);

router.delete(
  "/:id",
  requirePermission("MANAGE_ASSIGNMENTS"),
  assignmentController.deleteAssignment
);

// Intern routes
router.get(
  "/my/assignments",
  requirePermission("VIEW_OWN_ASSIGNMENTS"),
  assignmentController.getMyAssignments
);

export default router;
