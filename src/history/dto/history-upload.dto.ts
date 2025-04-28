import { IsString } from 'class-validator';

export class HistoryUploadDTO {
  @IsString()
  fileName: string;

  @IsString()
  contentType: string;
}
