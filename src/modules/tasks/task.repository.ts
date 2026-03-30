import { ITaskRepository } from "./task.interface.js";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto.js";
import { prisma } from "../../shared/prisma/prisma.service.js";
import { TaskStatus } from "./task.dto.js";
export class TaskRepository implements ITaskRepository {
  async findAll() {
    return prisma.task.findMany();
  }

  async findById(id: number) {
    return prisma.task.findUnique({
      where: { task_id: id },
    });
  }

  async create(data: CreateTaskDto) {
    return prisma.task.create({
      data,
    });
  }

  async update(id: number, data: UpdateTaskDto) {
    return prisma.task.update({
      where: { task_id: id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.task.delete({
      where: { task_id: id },
    });
  }

  async findByProjectId(projectId: number) {
    return prisma.task.findMany({
      where: { project_id: projectId },
    });
  }

  async findByStatus(status: TaskStatus) {
    return prisma.task.findMany({
      where: { status },
    });
  }

  async findByAssignedUserId(userId: number) {
    return prisma.task.findMany({
      where: { assigned_user_id: userId },
    });
  }

  async findByDeadlineRange(start: Date, end: Date) {
    return prisma.task.findMany({
      where: {
        deadline: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  async findOverdueTasks() {
    const now = new Date();
    return prisma.task.findMany({
      where: {
        deadline: {
          lt: now,
        },
        status: {
          not: "done",
        },
      },
    });
  }

  async findUpcomingTasks(daysAhead: number) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysAhead);

    return prisma.task.findMany({
      where: {
        deadline: {
          gte: now,
          lte: futureDate,
        },
        status: {
          not: "done",
        },
      },
    });
  }

  async findByKeyword(keyword: string) {
    return prisma.task.findMany({
      where: {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      },
    });
  }

  async findByMultipleCriteria(criteria: {
    status?: TaskStatus;
    assignedUserId?: number;
    deadlineBefore?: Date;
    deadlineAfter?: Date;
  }) {
    const { status, assignedUserId, deadlineBefore, deadlineAfter } = criteria;

    return prisma.task.findMany({
      where: {
        AND: [
          status ? { status } : {},
          assignedUserId ? { assigned_user_id: assignedUserId } : {},
          deadlineBefore ? { deadline: { lt: deadlineBefore } } : {},
          deadlineAfter ? { deadline: { gt: deadlineAfter } } : {},
        ],
      },
    });
  }
}

// Singleton
export const taskRepository = new TaskRepository();