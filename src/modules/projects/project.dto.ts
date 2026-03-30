export interface CreateProjectDto {
  name: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  manager_id?: number;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}