import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserDTO } from 'src/user/dtos/user.dto';
import { HistoryStatus } from '../entities/history-approval.entity';

export class HistoryApprovalDTO {
  @IsOptional()
  @IsString()
  observation: string;

  @IsEnum(HistoryStatus)
  status: HistoryStatus;

  @IsOptional()
  approvedBy: UserDTO;

  @IsOptional()
  date: Date;
}
