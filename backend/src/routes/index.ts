import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import uploadRoutes from "./upload.routes.js";
import assignmentRoutes from "./assignment.routes.js";
import taskRoutes from "./task.routes.js";
import requestRoutes from "./request.routes.js";
import dailyUpdateRoutes from "./daily-update.routes.js";
import messageRoutes from "./message.routes.js";
import attendanceRoutes from "./attendance.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "InternFlow API is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/uploads", uploadRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/tasks", taskRoutes);
router.use("/requests", requestRoutes);
router.use("/daily-updates", dailyUpdateRoutes);
router.use("/messages", messageRoutes);
router.use("/attendance", attendanceRoutes);

export default router;
