import { Router } from "express";
import { taskController } from "./task.controller.js";
import { TaskService } from "./task.service.js";
import { RabbitMQNotificationPublisher } from "./task.infrastructure.js";

const taskRouter = Router();
const notificationPublisher = new RabbitMQNotificationPublisher();
const taskService = new TaskService(notificationPublisher);
const taskControllerInstance = new taskController(taskService);
taskRouter.get("/", taskControllerInstance.getAll);

taskRouter.get("/:id", taskControllerInstance.getById);

taskRouter.post("/", (req, res) => taskControllerInstance.create(req, res));

taskRouter.patch("/:id", (req, res) => taskControllerInstance.update(req, res));

taskRouter.delete("/:id", (req, res) => taskControllerInstance.delete(req, res));

taskRouter.get("/project/:projectId", (req, res) => taskControllerInstance.getByProject(req, res));

export default taskRouter;