import { projectRepository } from "./project.repository.js";
import { CreateProjectDto, UpdateProjectDto } from "./project.dto.js";
import { Project } from "../../generated/prisma/client.js";

export class ProjectService {
  async getAllProjects(): Promise<Project[]> {
    return projectRepository.findAll();
  }

  async getProjectById(id: number): Promise<Project | null> {
    return projectRepository.findById(id);
  }

  async getProjectsByManagerId(managerId: number): Promise<Project[]> {
    return projectRepository.findByManagerId(managerId);
  }

  async createProject(data: CreateProjectDto): Promise<Project> {
    // Validation: end_date should be after start_date
    if (data.start_date && data.end_date && data.end_date <= data.start_date) {
      throw new Error("Ngày kết thúc phải sau ngày bắt đầu");
    }

    return projectRepository.create(data);
  }

  async updateProject(id: number, data: UpdateProjectDto): Promise<Project | null> {
    const existingProject = await projectRepository.findById(id);
    if (!existingProject) {
      throw new Error(`Project with ID ${id} not found`);
    }

    // Validation: end_date should be after start_date
    const startDate = data.start_date || existingProject.start_date;
    const endDate = data.end_date || existingProject.end_date;
    if (startDate && endDate && endDate <= startDate) {
      throw new Error("Ngày kết thúc phải sau ngày bắt đầu");
    }

    return projectRepository.update(id, data);
  }

  async deleteProject(id: number): Promise<Project | null> {
    const existingProject = await projectRepository.findById(id);
    if (!existingProject) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return projectRepository.delete(id);
  }
}

export const projectService = new ProjectService();