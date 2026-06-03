import { CreateTaskDto, UpdateTaskDto } from "./task.dto.js";
import { Task } from "../../generated/prisma/client.js";
import { TaskStatus } from "./task.dto.js";
export interface ITaskRepository {
  findAll(): Promise<Task[]>;

  findById(id: number): Promise<Task | null>;

  findByProjectId(projectId: number): Promise<Task[]>;

  findByStatus(status: TaskStatus): Promise<Task[]>;

  findByAssignedUserId(userId: number): Promise<Task[]>;

  findByDeadlineRange(start: Date, end: Date): Promise<Task[]>;

  findOverdueTasks(): Promise<Task[]>;

  findUpcomingTasks(daysAhead: number): Promise<Task[]>;

  findByKeyword(keyword: string): Promise<Task[]>;

  findByMultipleCriteria(criteria: {
    status?: string;
    assignedUserId?: number;
    deadlineBefore?: Date;
    deadlineAfter?: Date;
  }): Promise<Task[]>;

  create(data: CreateTaskDto): Promise<Task>;

  update(id: number, data: UpdateTaskDto): Promise<Task | null>;

  delete(id: number): Promise<Task | null>;
}
export interface TaskData {
  id: number;
  name: string;
  description?: string;
  deadline?: Date;
  status: TaskStatus;
  project_id?: number;
  assigned_user_id?: number;
}

export interface INotificationPublisher {
  publish(taskData: TaskData): Promise<void>;
}

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
export { TaskStatus };

