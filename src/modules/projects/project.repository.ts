import { IProjectRepository } from "./project.interface.js";
import { CreateProjectDto, UpdateProjectDto } from "./project.dto.js";
import { prisma } from "../../shared/prisma/prisma.service.js";
import { Project } from "../../generated/prisma/client.js";

export class ProjectRepository implements IProjectRepository {
  async findAll(): Promise<Project[]> {
    return prisma.project.findMany({
      include: {
        User: true,
        Task: true,
        Report: true
      }
    });
  }

  async findById(id: number): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { project_id: id },
      include: {
        User: true,
        Task: true,
        Report: true
      }
    });
  }

  async findByManagerId(managerId: number): Promise<Project[]> {
    return prisma.project.findMany({
      where: { manager_id: managerId },
      include: {
        User: true,
        Task: true,
        Report: true
      }
    });
  }

  async create(data: CreateProjectDto): Promise<Project> {
    return prisma.project.create({
      data,
      include: {
        User: true,
        Task: true,
        Report: true
      }
    });
  }

  async update(id: number, data: UpdateProjectDto): Promise<Project | null> {
    return prisma.project.update({
      where: { project_id: id },
      data,
      include: {
        User: true,
        Task: true,
        Report: true
      }
    });
  }

  async delete(id: number): Promise<Project | null> {
    return prisma.project.delete({
      where: { project_id: id },
      include: {
        User: true,
        Task: true,
        Report: true
      }
    });
  }
}

export const projectRepository = new ProjectRepository();