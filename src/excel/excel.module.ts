import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { HistoryModule } from 'src/history/history.module'; // ✅ Importa o módulo

@Module({
  imports: [HistoryModule],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
