import { Router } from "express";
import { userController } from "./user.controller.js";
import { authenticateToken } from "../../app/middleware/auth.js";

const userRouter = Router();

userRouter.post("/", userController.create);

userRouter.get("/", authenticateToken, userController.getAll);

userRouter.get("/:id", authenticateToken, userController.getById);

userRouter.patch("/:id", authenticateToken, userController.update);

userRouter.delete("/:id", authenticateToken, userController.delete);

export default userRouter;