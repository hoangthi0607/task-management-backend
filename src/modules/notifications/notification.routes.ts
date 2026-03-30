import { Router } from "express";
import { notificationController } from "./notification.controller.js";

const notificationRouter = Router();

notificationRouter.get("/", notificationController.getAll);

notificationRouter.get("/:id", notificationController.getById);

notificationRouter.get("/user/:userId", notificationController.getByUserId);

notificationRouter.get("/task/:taskId", notificationController.getByTaskId);

notificationRouter.post("/", notificationController.create);

notificationRouter.patch("/:id", notificationController.update);

notificationRouter.delete("/:id", notificationController.delete);

export default notificationRouter;