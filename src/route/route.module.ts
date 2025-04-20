import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HistoryModule } from 'src/history/history.module';
import { UserModule } from 'src/user/user.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { Route } from './entities/route.entity';
import { GeoCodeService } from './geocode.service';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Route]),
    UserModule,
    VehicleModule,
    HistoryModule,
  ],
  providers: [RouteService, GeoCodeService],
  controllers: [RouteController],
  exports: [RouteService, GeoCodeService],
})
export class RouteModule {}
