import { Router } from "express";
import { reportController } from "./report.controller.js";

const reportRouter = Router();

reportRouter.get("/", reportController.getAll);

reportRouter.get("/:id", reportController.getById);

reportRouter.get("/project/:projectId", reportController.getByProjectId);

reportRouter.post("/", reportController.create);

reportRouter.post("/project/:projectId/generate", reportController.generateProjectReport);

reportRouter.patch("/:id", reportController.update);

reportRouter.delete("/:id", reportController.delete);

export default reportRouter;