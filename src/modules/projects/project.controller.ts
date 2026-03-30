import { Request, Response } from "express";
import { projectService } from "./project.service.js";
import { CreateProjectDto } from "./project.dto.js";

export class ProjectController {
  async getAll(req: Request, res: Response) {
    try {
      const projects = await projectService.getAllProjects();
      res.status(200).json({
        total: projects.length,
        data: projects
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy danh sách dự án" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID dự án không hợp lệ" });
      }

      const project = await projectService.getProjectById(id);
      if (!project) {
        return res.status(404).json({ message: "Không tìm thấy dự án" });
      }

      res.status(200).json(project);
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy dự án" });
    }
  }

  async getByManagerId(req: Request, res: Response) {
    try {
      const managerId = parseInt(req.params.managerId as string);
      if (isNaN(managerId)) {
        return res.status(400).json({ message: "ID quản lý không hợp lệ" });
      }

      const projects = await projectService.getProjectsByManagerId(managerId);
      res.status(200).json({
        total: projects.length,
        data: projects
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy dự án của quản lý" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CreateProjectDto = req.body;
      const project = await projectService.createProject(data);
      res.status(201).json({
        message: "Tạo dự án thành công",
        data: project
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID dự án không hợp lệ" });
      }

      const data: Partial<CreateProjectDto> = req.body;
      const project = await projectService.updateProject(id, data);
      if (!project) {
        return res.status(404).json({ message: "Không tìm thấy dự án để cập nhật" });
      }

      res.status(200).json({
        message: "Cập nhật dự án thành công",
        data: project
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID dự án không hợp lệ" });
      }

      const project = await projectService.deleteProject(id);
      if (!project) {
        return res.status(404).json({ message: "Không tìm thấy dự án để xóa" });
      }

      res.status(200).json({
        message: "Xóa dự án thành công",
        data: project
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const projectController = new ProjectController();