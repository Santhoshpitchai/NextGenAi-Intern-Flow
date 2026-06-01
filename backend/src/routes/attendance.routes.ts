import { Router } from "express";
import { attendanceController } from "../controllers/attendance.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
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

router.post("/check-in", requireRole([UserRole.INTERN]), attendanceController.checkIn);
router.post("/check-out", requireRole([UserRole.INTERN]), attendanceController.checkOut);
router.get("/my", requireRole([UserRole.INTERN]), attendanceController.getMyRecords);
router.get(
  "/today",
  requireRole([UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN]),
  attendanceController.getTodayRecords,
);
router.get(
  "/all",
  requireRole([UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN]),
  attendanceController.getAllRecords,
);

export default router;
