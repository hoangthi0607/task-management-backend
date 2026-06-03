import { taskRepository } from "./task.repository.js";
import { Prisma, Task } from "../../generated/prisma/client.js";
import { CreateTaskDto, UpdateTaskDto } from "./task.dto.js";
import { INotificationPublisher } from "./task.interface.js";

export class TaskService {
  private notificationPublisher: INotificationPublisher;

  constructor(notificationPublisher: INotificationPublisher) {
    this.notificationPublisher = notificationPublisher;
  }
  /**
   * Tạo một công việc mới
   */
  async createTask(data: CreateTaskDto): Promise<Task> {
    // Logic: Nếu có deadline, kiểm tra xem deadline có phải là ngày trong quá khứ không
    if (data.deadline && new Date(data.deadline) < new Date()) {
      throw new Error("Thời hạn (deadline) không được là ngày trong quá khứ");
    }
    const createdTask = await taskRepository.create(data);
    await this.notificationPublisher.publish({
      id:  createdTask.task_id, // Sử dụng ID tạm thời nếu chưa có
      name: createdTask.name,
      description: createdTask.description || "",
      deadline: createdTask.deadline || undefined,
      status: createdTask.status || "todo",
      project_id: createdTask.project_id || undefined,
      assigned_user_id: createdTask.assigned_user_id || undefined
    });

    return createdTask;
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
    await this.notificationPublisher.publish({
      id: taskId,
      status: "done",
      name: "", // Có thể thêm tên nếu cần
      description: "",
      deadline: undefined,
      project_id: undefined,
      assigned_user_id: undefined
    });
    return taskRepository.update(taskId, { status: "done" });
  }
}
