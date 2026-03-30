import { Router } from "express";
import { authController } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/register", (req, res) => authController.register(req, res));

authRouter.post("/login", (req, res) => authController.login(req, res));

authRouter.post("/refresh", (req, res) => authController.refreshToken(req, res));

export default authRouter;