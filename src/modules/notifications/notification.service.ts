import { notificationRepository } from "./notification.repository.js";
import { CreateNotificationDto, UpdateNotificationDto } from "./notification.dto.js";
import { Notification } from "../../generated/prisma/client.js";

export class NotificationService {
  async getAllNotifications(): Promise<Notification[]> {
    return notificationRepository.findAll();
  }

  async getNotificationById(id: number): Promise<Notification | null> {
    return notificationRepository.findById(id);
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return notificationRepository.findByUserId(userId);
  }

  async getNotificationsByTaskId(taskId: number): Promise<Notification[]> {
    return notificationRepository.findByTaskId(taskId);
  }

  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    return notificationRepository.create(data);
  }

  async updateNotification(id: number, data: UpdateNotificationDto): Promise<Notification | null> {
    const existingNotification = await notificationRepository.findById(id);
    if (!existingNotification) {
      throw new Error(`Notification with ID ${id} not found`);
    }
    return notificationRepository.update(id, data);
  }

  async deleteNotification(id: number): Promise<Notification | null> {
    const existingNotification = await notificationRepository.findById(id);
    if (!existingNotification) {
      throw new Error(`Notification with ID ${id} not found`);
    }
    return notificationRepository.delete(id);
  }

  async createTaskNotification(taskId: number, userId: number, message: string): Promise<Notification> {
    return notificationRepository.create({
      message,
      task_id: taskId,
      user_id: userId
    });
  }

  async createUserNotification(userId: number, message: string): Promise<Notification> {
    return notificationRepository.create({
      message,
      user_id: userId
    });
  }
}

export const notificationService = new NotificationService();