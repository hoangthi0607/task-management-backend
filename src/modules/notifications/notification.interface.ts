import { CreateNotificationDto, UpdateNotificationDto } from "./notification.dto.js";
import { Notification } from "../../generated/prisma/client.js";

export interface INotificationRepository {
  findAll(): Promise<Notification[]>;
  findById(id: number): Promise<Notification | null>;
  findByUserId(userId: number): Promise<Notification[]>;
  findByTaskId(taskId: number): Promise<Notification[]>;
  create(data: CreateNotificationDto): Promise<Notification>;
  update(id: number, data: UpdateNotificationDto): Promise<Notification | null>;
  delete(id: number): Promise<Notification | null>;
}