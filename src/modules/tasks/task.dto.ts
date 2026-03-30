export type TaskStatus = "todo" | "in_progress" | "done";

export interface CreateTaskDto {
  name: string;
  description?: string;
  deadline?: Date;          // @db.Date
  status?: TaskStatus;      // optional vì có default = todo
  project_id?: number;
  assigned_user_id?: number;
}

export interface UpdateTaskDto {
  name?: string;
  description?: string;
  deadline?: Date;
  status?: TaskStatus;
  project_id?: number;
  assigned_user_id?: number;
}