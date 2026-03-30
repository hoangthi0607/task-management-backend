import { Request, Response } from "express";
import { reportService } from "./report.service.js";
import { CreateReportDto } from "./report.dto.js";

export class ReportController {
  async getAll(req: Request, res: Response) {
    try {
      const reports = await reportService.getAllReports();
      res.status(200).json({
        total: reports.length,
        data: reports
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy danh sách báo cáo" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID báo cáo không hợp lệ" });
      }

      const report = await reportService.getReportById(id);
      if (!report) {
        return res.status(404).json({ message: "Không tìm thấy báo cáo" });
      }

      res.status(200).json(report);
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy báo cáo" });
    }
  }

  async getByProjectId(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.projectId as string);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "ID dự án không hợp lệ" });
      }

      const reports = await reportService.getReportsByProjectId(projectId);
      res.status(200).json({
        total: reports.length,
        data: reports
      });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi hệ thống khi lấy báo cáo của dự án" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CreateReportDto = req.body;
      const report = await reportService.createReport(data);
      res.status(201).json({
        message: "Tạo báo cáo thành công",
        data: report
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async generateProjectReport(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.projectId as string);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "ID dự án không hợp lệ" });
      }

      const report = await reportService.generateProjectReport(projectId);
      res.status(201).json({
        message: "Tạo báo cáo dự án thành công",
        data: report
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID báo cáo không hợp lệ" });
      }

      const data: Partial<CreateReportDto> = req.body;
      const report = await reportService.updateReport(id, data);
      if (!report) {
        return res.status(404).json({ message: "Không tìm thấy báo cáo để cập nhật" });
      }

      res.status(200).json({
        message: "Cập nhật báo cáo thành công",
        data: report
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID báo cáo không hợp lệ" });
      }

      const report = await reportService.deleteReport(id);
      if (!report) {
        return res.status(404).json({ message: "Không tìm thấy báo cáo để xóa" });
      }

      res.status(200).json({
        message: "Xóa báo cáo thành công",
        data: report
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const reportController = new ReportController();