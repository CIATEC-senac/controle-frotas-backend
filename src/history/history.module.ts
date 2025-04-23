import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HistoryApproval } from './entities/history-approval.entity';
import { History } from './entities/history.entity';
import { UnplannedStop } from './entities/unplanned-stop.entity';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([History, HistoryApproval, UnplannedStop]),
  ],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
