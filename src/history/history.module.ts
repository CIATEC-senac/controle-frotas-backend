import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationModule } from 'src/notifications/notification.module';
import { UserModule } from 'src/user/user.module';
import { HistoryApproval } from './entities/history-approval.entity';
import { History } from './entities/history.entity';
import { UnplannedStop } from './entities/unplanned-stop.entity';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([History, HistoryApproval, UnplannedStop]),
    NotificationModule,
    UserModule,
  ],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
