import { taskRepository } from "./task.repository.js";
import { Prisma, Task } from "../../generated/prisma/client.js";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto.js";

export class TaskService {
  /**
   * Tạo một công việc mới
   */
  async createTask(data: CreateTaskDto): Promise<Task> {
    // Logic: Nếu có deadline, kiểm tra xem deadline có phải là ngày trong quá khứ không
    if (data.deadline && new Date(data.deadline) < new Date()) {
      throw new Error("Thời hạn (deadline) không được là ngày trong quá khứ");
    }

    return taskRepository.create(data);
  }

  /**
   * Lấy chi tiết công việc
   */
  async getTaskById(taskId: number): Promise<Task> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new Error(`Không tìm thấy công việc có ID: ${taskId}`);
    }
    return task;
  }

  /**
   * Lấy tất cả công việc (Có thể mở rộng thêm filter ở đây)
   */
  async getAllTasks(): Promise<Task[]> {
    return taskRepository.findAll();
  }

  /**
   * Cập nhật công việc
   */
  async updateTask(taskId: number, data: UpdateTaskDto): Promise<Task> {
    // Kiểm tra tồn tại trước khi cập nhật
    const existingTask = await taskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error("Công việc không tồn tại");
    }

    // Logic: Nếu công việc đã 'done', không cho phép đổi deadline (ví dụ)
    if (existingTask.status === 'done' && data.deadline) {
      throw new Error("Không thể thay đổi thời hạn cho công việc đã hoàn thành");
    }

    return taskRepository.update(taskId, data);
  }

  /**
   * Xóa công việc
   */
  async deleteTask(taskId: number): Promise<Task> {
    const existingTask = await taskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error("Công việc không tồn tại để xóa");
    }
    return taskRepository.delete(taskId);
  }

  /**
   * Lấy danh sách task theo Project ID
   */
  async getTasksByProject(projectId: number): Promise<Task[]> {
    return taskRepository.findByProjectId(projectId);
  }

  /**
   * Logic nâng cao: Chuyển trạng thái task sang 'done'
   */
  async markAsDone(taskId: number): Promise<Task> {
    return taskRepository.update(taskId, { status: 'done' });
  }
}