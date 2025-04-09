import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleController } from './vehicle.controller';

@Module({
  providers: [VehicleService],
  controllers: [VehicleController],
  exports: [VehicleService],
  imports: [TypeOrmModule.forFeature([Vehicle])],
})
export class VehicleModule {}
