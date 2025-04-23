import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserDTO } from 'src/user/dtos/user.dto';
import { HistoryStatus } from '../entities/history-approval.entity';

// Classe que define os dados esperados para aprovar rota
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
