import { IReportRepository } from "./report.interface.js";
import { CreateReportDto, UpdateReportDto } from "./report.dto.js";
import { prisma } from "../../shared/prisma/prisma.service.js";
import { Report } from "../../generated/prisma/client.js";

export class ReportRepository implements IReportRepository {
  async findAll(): Promise<Report[]> {
    return prisma.report.findMany({
      include: {
        Project: true
      }
    });
  }

  async findById(id: number): Promise<Report | null> {
    return prisma.report.findUnique({
      where: { report_id: id },
      include: {
        Project: true
      }
    });
  }

  async findByProjectId(projectId: number): Promise<Report[]> {
    return prisma.report.findMany({
      where: { project_id: projectId },
      include: {
        Project: true
      }
    });
  }

  async create(data: CreateReportDto): Promise<Report> {
    return prisma.report.create({
      data,
      include: {
        Project: true
      }
    });
  }

  async update(id: number, data: UpdateReportDto): Promise<Report | null> {
    return prisma.report.update({
      where: { report_id: id },
      data,
      include: {
        Project: true
      }
    });
  }

  async delete(id: number): Promise<Report | null> {
    return prisma.report.delete({
      where: { report_id: id },
      include: {
        Project: true
      }
    });
  }
}

export const reportRepository = new ReportRepository();