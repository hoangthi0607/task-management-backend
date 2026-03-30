import { Router } from "express";
import { roleController } from "./role.controller.js";

const roleRouter = Router();

roleRouter.get("/", roleController.getAll);

roleRouter.get("/:id", roleController.getById);

roleRouter.post("/", roleController.create);

roleRouter.patch("/:id", roleController.update);

roleRouter.delete("/:id", roleController.delete);

export default roleRouter;