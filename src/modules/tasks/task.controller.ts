import { Request, Response } from "express";
import { TaskService } from "./task.service.js";

// Khởi tạo instance service
const taskService = new TaskService();

export const taskController = {
  /**
   * Tạo task mới
   * POST /tasks
   */
  async create(req: Request, res: Response) {
    try {
      const task = await taskService.createTask(req.body);
      res.status(201).json({
        message: "Tạo công việc thành công",
        data: task
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Lấy tất cả task
   * GET /tasks
   */
  async getAll(req: Request, res: Response) {
    try {
      const tasks = await taskService.getAllTasks();
      res.status(200).json({
        total: tasks.length,
        data: tasks
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy danh sách công việc" });
    }
  },
/**
   * Lấy chi tiết task theo ID
   */
  async getById(req: Request, res: Response) {
    try {
      // Cách 1: Ép kiểu as string để TypeScript yên tâm
      const idParam = req.params.id as string; 
      const taskId = parseInt(idParam);

      if (isNaN(taskId)) {
        return res.status(400).json({ message: "ID công việc không hợp lệ" });
      }

      const task = await taskService.getTaskById(taskId);
      res.status(200).json(task);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  },

  /**
   * Cập nhật task
   */
  async update(req: Request, res: Response) {
    try {
      // Cách 2: Sử dụng String() constructor - an toàn tuyệt đối
      const taskId = parseInt(String(req.params.id));

      if (isNaN(taskId)) {
        return res.status(400).json({ message: "ID công việc không hợp lệ" });
      }

      const updatedTask = await taskService.updateTask(taskId, req.body);
      res.status(200).json({
        message: "Cập nhật công việc thành công",
        data: updatedTask
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Xóa task
   */
  async delete(req: Request, res: Response) {
    try {
      const taskId = parseInt(req.params.id as string);

      if (isNaN(taskId)) {
        return res.status(400).json({ message: "ID công việc không hợp lệ" });
      }

      await taskService.deleteTask(taskId);
      res.status(200).json({ message: `Đã xóa công việc thành công` });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Lấy danh sách task của một project cụ thể
   */
  async getByProject(req: Request, res: Response) {
    try {
      // Kiểm tra sự tồn tại của projectId
      const { projectId } = req.params;
      
      if (!projectId) {
        return res.status(400).json({ message: "Thiếu ID dự án" });
      }

      const id = parseInt(projectId as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID dự án không hợp lệ" });
      }

      const tasks = await taskService.getTasksByProject(id);
      res.status(200).json({
        project_id: id,
        total: tasks.length,
        data: tasks
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
};