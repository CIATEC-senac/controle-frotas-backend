import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { HistoryService } from 'src/history/history.service';
import { ExcelService } from './excel.service';

@Controller('excel')
export class ExcelController {
  constructor(
    private readonly excelService: ExcelService,
    private readonly historyService: HistoryService,
  ) {}

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
