export interface CreateReportDto {
  project_id?: number;
  content?: string;
}

export interface UpdateReportDto extends Partial<CreateReportDto> {}