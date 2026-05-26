import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/rbac.middleware.js";

const router = Router();

router.use(authenticate);

// Admin routes
router.post("/", requirePermission("MANAGE_TASKS"), taskController.createTask);
router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTaskById);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", requirePermission("MANAGE_TASKS"), taskController.deleteTask);

// Intern routes
router.get("/my/tasks", requirePermission("VIEW_OWN_TASKS"), taskController.getMyTasks);
router.post("/:id/progress", requirePermission("UPDATE_TASK_PROGRESS"), taskController.addProgress);

export default router;
