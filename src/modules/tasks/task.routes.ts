import { Router } from "express";
import { taskController } from "./task.controller.js";

const taskRouter = Router();

taskRouter.get("/", taskController.getAll);

taskRouter.get("/:id", taskController.getById);

taskRouter.post("/", taskController.create);

taskRouter.patch("/:id", taskController.update);

taskRouter.delete("/:id", taskController.delete);

taskRouter.get("/project/:projectId", taskController.getByProject);

export default taskRouter;