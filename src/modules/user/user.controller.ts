import { Request,Response } from "express";
import { userService } from "./user.service.js";

export class UserController {
    async getAll(req: Request, res: Response) {
        const users = await userService.getAll();
        res.json(users);
    }

    async getById(req: Request<{ id: string }>, res: Response) {
        const id = parseInt(req.params.id);
        const user = await userService.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }

    async create(req: Request, res: Response) {
        const data = req.body;
        const newUser = await userService.create(data);
        res.status(201).json(newUser);
    }

    async update(req: Request<{ id: string }>, res: Response) {
        const id = parseInt(req.params.id);
        const data = req.body;
        const updatedUser = await userService.update(id, data);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    }

    async delete(req: Request<{ id: string }>, res: Response) {
        const id = parseInt(req.params.id);
        const deletedUser = await userService.delete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(deletedUser);
    }
}

// Singleton
export const userController = new UserController();