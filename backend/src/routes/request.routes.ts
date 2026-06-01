import { Router } from "express";
import { requestController } from "../controllers/request.controller";
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

router.post("/", requestController.createRequest);
router.get("/my", requestController.getMyRequests);
router.get(
  "/all",
  requireRole([UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN]),
  requestController.getAllRequests,
);
router.get("/:id", requestController.getRequestById);
router.patch(
  "/:id",
  requireRole([UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN]),
  requestController.updateRequest,
);
router.delete("/:id", requestController.deleteRequest);

export default router;
