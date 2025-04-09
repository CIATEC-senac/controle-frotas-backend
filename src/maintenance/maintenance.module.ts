import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenance.entity';

@Module({
  providers: [MaintenanceService],
  controllers: [MaintenanceController],
  exports: [MaintenanceService],
  imports: [TypeOrmModule.forFeature([Maintenance])],
})
export class ManutencaoModule {}
