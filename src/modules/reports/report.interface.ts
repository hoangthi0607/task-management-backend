import { CreateReportDto, UpdateReportDto } from "./report.dto.js";
import { Report } from "../../generated/prisma/client.js";

export interface IReportRepository {
  findAll(): Promise<Report[]>;
  findById(id: number): Promise<Report | null>;
  findByProjectId(projectId: number): Promise<Report[]>;
  create(data: CreateReportDto): Promise<Report>;
  update(id: number, data: UpdateReportDto): Promise<Report | null>;
  delete(id: number): Promise<Report | null>;
}