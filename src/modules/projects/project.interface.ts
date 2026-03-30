import { CreateProjectDto, UpdateProjectDto } from "./project.dto.js";
import { Project } from "../../generated/prisma/client.js";

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: number): Promise<Project | null>;
  findByManagerId(managerId: number): Promise<Project[]>;
  create(data: CreateProjectDto): Promise<Project>;
  update(id: number, data: UpdateProjectDto): Promise<Project | null>;
  delete(id: number): Promise<Project | null>;
}