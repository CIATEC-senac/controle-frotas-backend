import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { GeoCodeService } from './geocode.service';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { UserModule } from 'src/user/user.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';

@Module({
  imports: [TypeOrmModule.forFeature([Route]), UserModule, VehicleModule],
  providers: [RouteService, GeoCodeService],
  controllers: [RouteController],
  exports: [RouteService, GeoCodeService],
})
export class RouteModule {}
