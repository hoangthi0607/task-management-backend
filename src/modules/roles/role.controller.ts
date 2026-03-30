import { Request, Response } from "express";
import { roleService } from "./role.service.js";
import { CreateRoleDto } from "./role.dto.js";

export class RoleController {
  async getAll(req: Request, res: Response) {
    try {
      const roles = await roleService.getAllRoles();
      res.status(200).json({
        total: roles.length,
        data: roles
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy danh sách vai trò" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID vai trò không hợp lệ" });
      }

      const role = await roleService.getRoleById(id);
      if (!role) {
        return res.status(404).json({ message: "Không tìm thấy vai trò" });
      }

      res.status(200).json(role);
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy vai trò" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CreateRoleDto = req.body;
      const role = await roleService.createRole(data);
      res.status(201).json({
        message: "Tạo vai trò thành công",
        data: role
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID vai trò không hợp lệ" });
      }

      const data: Partial<CreateRoleDto> = req.body;
      const role = await roleService.updateRole(id, data);
      if (!role) {
        return res.status(404).json({ message: "Không tìm thấy vai trò để cập nhật" });
      }

      res.status(200).json({
        message: "Cập nhật vai trò thành công",
        data: role
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID vai trò không hợp lệ" });
      }

      const role = await roleService.deleteRole(id);
      if (!role) {
        return res.status(404).json({ message: "Không tìm thấy vai trò để xóa" });
      }

      res.status(200).json({
        message: "Xóa vai trò thành công",
        data: role
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const roleController = new RoleController();