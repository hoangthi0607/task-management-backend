import { Router } from "express";
import { projectController } from "./project.controller.js";

const projectRouter = Router();

projectRouter.get("/", projectController.getAll);

projectRouter.get("/:id", projectController.getById);

projectRouter.get("/manager/:managerId", projectController.getByManagerId);

projectRouter.post("/", projectController.create);

projectRouter.patch("/:id", projectController.update);

projectRouter.delete("/:id", projectController.delete);

export default projectRouter;