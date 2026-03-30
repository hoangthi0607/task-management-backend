import { Request, Response } from "express";
import { notificationService } from "./notification.service.js";
import { CreateNotificationDto } from "./notification.dto.js";

export class NotificationController {
  async getAll(req: Request, res: Response) {
    try {
      const notifications = await notificationService.getAllNotifications();
      res.status(200).json({
        total: notifications.length,
        data: notifications
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy danh sách thông báo" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID thông báo không hợp lệ" });
      }

      const notification = await notificationService.getNotificationById(id);
      if (!notification) {
        return res.status(404).json({ message: "Không tìm thấy thông báo" });
      }

      res.status(200).json(notification);
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy thông báo" });
    }
  }

  async getByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "ID người dùng không hợp lệ" });
      }

      const notifications = await notificationService.getNotificationsByUserId(userId);
      res.status(200).json({
        total: notifications.length,
        data: notifications
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy thông báo của người dùng" });
    }
  }

  async getByTaskId(req: Request, res: Response) {
    try {
      const taskId = parseInt(req.params.taskId as string);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "ID công việc không hợp lệ" });
      }

      const notifications = await notificationService.getNotificationsByTaskId(taskId);
      res.status(200).json({
        total: notifications.length,
        data: notifications
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy thông báo của công việc" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CreateNotificationDto = req.body;
      const notification = await notificationService.createNotification(data);
      res.status(201).json({
        message: "Tạo thông báo thành công",
        data: notification
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID thông báo không hợp lệ" });
      }

      const data: Partial<CreateNotificationDto> = req.body;
      const notification = await notificationService.updateNotification(id, data);
      if (!notification) {
        return res.status(404).json({ message: "Không tìm thấy thông báo để cập nhật" });
      }

      res.status(200).json({
        message: "Cập nhật thông báo thành công",
        data: notification
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID thông báo không hợp lệ" });
      }

      const notification = await notificationService.deleteNotification(id);
      if (!notification) {
        return res.status(404).json({ message: "Không tìm thấy thông báo để xóa" });
      }

      res.status(200).json({
        message: "Xóa thông báo thành công",
        data: notification
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const notificationController = new NotificationController();