import { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { LoginDto, RegisterDto, RefreshTokenDto } from "./auth.dto.js";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      console.log("[AuthController.register] Received request with body:", req.body);
      const data: RegisterDto = req.body;
      const user = await authService.register(data);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data: LoginDto = req.body;
      const result = await authService.login(data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const data: RefreshTokenDto = req.body;
      const result = await authService.refreshToken(data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const authController = new AuthController();