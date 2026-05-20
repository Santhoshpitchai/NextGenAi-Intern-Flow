import { Router } from "express";
import { UserRole } from "@prisma/client";
import * as userController from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  updateAdminProfileSchema,
  updateInternProfileSchema,
} from "../validators/user.validator.js";

const router = Router();

router.use(authenticate);

router.patch(
  "/profile",
  (req, res, next) => {
    const schema =
      req.user?.role === UserRole.INTERN ? updateInternProfileSchema : updateAdminProfileSchema;
    return validate(schema)(req, res, next);
  },
  authorize(UserRole.INTERN, UserRole.COMPANY_ADMIN),
  userController.updateProfile,
);

export default router;
