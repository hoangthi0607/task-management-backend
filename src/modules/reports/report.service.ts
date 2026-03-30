import { reportRepository } from "./report.repository.js";
import { CreateReportDto, UpdateReportDto } from "./report.dto.js";
import { Report } from "../../generated/prisma/client.js";

export class ReportService {
  async getAllReports(): Promise<Report[]> {
    return reportRepository.findAll();
  }

  async getReportById(id: number): Promise<Report | null> {
    return reportRepository.findById(id);
  }

  async getReportsByProjectId(projectId: number): Promise<Report[]> {
    return reportRepository.findByProjectId(projectId);
  }

  async createReport(data: CreateReportDto): Promise<Report> {
    return reportRepository.create(data);
  }

  async updateReport(id: number, data: UpdateReportDto): Promise<Report | null> {
    const existingReport = await reportRepository.findById(id);
    if (!existingReport) {
      throw new Error(`Report with ID ${id} not found`);
    }

    return reportRepository.update(id, data);
  }

  async deleteReport(id: number): Promise<Report | null> {
    const existingReport = await reportRepository.findById(id);
    if (!existingReport) {
      throw new Error(`Report with ID ${id} not found`);
    }
    return reportRepository.delete(id);
  }

  async generateProjectReport(projectId: number): Promise<Report> {
    // This would typically generate a report based on project data
    // For now, just create a basic report
    const content = `Báo cáo cho dự án ${projectId} được tạo vào ${new Date().toISOString()}`;

    return reportRepository.create({
      project_id: projectId,
      content
    });
  }
}

export const reportService = new ReportService();