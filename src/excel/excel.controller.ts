import { Controller, Get, Param, Res, UseGuards, Header } from '@nestjs/common';
import { Response } from 'express';
import { ExcelService } from './excel.service';
import { HistoryService } from 'src/history/history.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@UseGuards(AuthGuard, RolesGuard)
@Controller('excel')
export class ExcelController {
  constructor(
    private readonly excelService: ExcelService,
    private readonly historyService: HistoryService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get(':id')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename=relatorio.xlsx')
  async downloadExcel(@Param('id') id: string, @Res() res: Response) {
    const history = await this.historyService.findOne(Number(id));
    const buffer = await this.excelService.generateExcel(history);
    res.end(buffer);
  }
}
