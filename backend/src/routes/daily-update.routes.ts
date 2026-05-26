import { Router } from "express";
import { dailyUpdateController } from "../controllers/daily-update.controller";
import { authenticate } from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authenticate);

// Helper middleware to check roles
const requireRole = (roles: UserRole[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

router.post("/", dailyUpdateController.createUpdate);
router.get("/my", dailyUpdateController.getMyUpdates);
router.get("/all", requireRole([UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN]), dailyUpdateController.getAllUpdates);
router.get("/:id", dailyUpdateController.getUpdateById);
router.delete("/:id", dailyUpdateController.deleteUpdate);

export default router;
