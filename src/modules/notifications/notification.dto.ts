export interface CreateNotificationDto {
  title?: string;
  content?: string;
  message: string;
  user_id?: number;
  task_id?: number;
}

export interface UpdateNotificationDto extends Partial<CreateNotificationDto> {}