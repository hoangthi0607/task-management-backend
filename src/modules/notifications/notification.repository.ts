import { INotificationRepository } from "./notification.interface.js";
import { CreateNotificationDto, UpdateNotificationDto } from "./notification.dto.js";
import { prisma } from "../../shared/prisma/prisma.service.js";
import { Notification } from "../../generated/prisma/client.js";

export class NotificationRepository implements INotificationRepository {
  async findAll(): Promise<Notification[]> {
    return prisma.notification.findMany({
      include: {
        User: true,
        Task: true
      }
    });
  }

  async findById(id: number): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { notification_id: id },
      include: {
        User: true,
        Task: true
      }
    });
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { user_id: userId },
      include: {
        User: true,
        Task: true
      }
    });
  }

  async findByTaskId(taskId: number): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { task_id: taskId },
      include: {
        User: true,
        Task: true
      }
    });
  }

  async create(data: CreateNotificationDto): Promise<Notification> {
    return prisma.notification.create({
      data,
      include: {
        User: true,
        Task: true
      }
    });
  }

  async update(id: number, data: UpdateNotificationDto): Promise<Notification | null> {
    return prisma.notification.update({
      where: { notification_id: id },
      data,
      include: {
        User: true,
        Task: true
      }
    });
  }

  async delete(id: number): Promise<Notification | null> {
    return prisma.notification.delete({
      where: { notification_id: id },
      include: {
        User: true,
        Task: true
      }
    });
  }
}

export const notificationRepository = new NotificationRepository();