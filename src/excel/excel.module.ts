import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { HistoryModule } from 'src/history/history.module';
import { RouteModule } from 'src/route/route.module';

@Module({
  imports: [HistoryModule, RouteModule],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}
