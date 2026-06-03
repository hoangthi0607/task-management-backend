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

export interface INotificationPublisher {
  publish(event: any): Promise<void>;
}

// src/notifications/notification.interface.ts
export interface TaskDueEvent {
  eventId: string;
  taskId: string;
  userId: string;
  scheduled_at: Date;
  eventType: string;
  timestamp: string;
  payload: {
    title: string;
    body: string;
  };
}
