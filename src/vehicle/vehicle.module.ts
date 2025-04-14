import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleController } from './vehicle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [VehicleService],
  controllers: [VehicleController],
  exports: [VehicleService],
})
export class VehicleModule {}
