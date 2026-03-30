import { Router } from "express";
import userRoutes from "../../modules/user/user.routes.js";
import authRoutes from "../../modules/auth/auth.routes.js";
import taskRoutes from "../../modules/tasks/task.routes.js";
import projectRoutes from "../../modules/projects/project.routes.js";
import reportRoutes from "../../modules/reports/report.routes.js";
import roleRoutes from "../../modules/roles/role.routes.js";
import notificationRoutes from "../../modules/notifications/notification.routes.js";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/projects", projectRoutes);
router.use("/reports", reportRoutes);
router.use("/roles", roleRoutes);
router.use("/notifications", notificationRoutes);

export default router;