import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  registerAdminSchema,
  registerInternSchema,
  loginSchema,
  logoutSchema,
} from "../validators/auth.validator.js";
import { uploadInternRegistration, handleMulterError } from "../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/register/admin",
  validate(registerAdminSchema),
  authController.registerAdmin,
);

router.post(
  "/register/intern",
  uploadInternRegistration.fields([
    { name: "resume", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
  ]),
  handleMulterError,
  validate(registerInternSchema),
  authController.registerIntern,
);

router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", validate(logoutSchema), authController.refresh);
router.post("/logout", validate(logoutSchema), authController.logout);
router.get("/me", authenticate, authController.getMe);

export default router;
