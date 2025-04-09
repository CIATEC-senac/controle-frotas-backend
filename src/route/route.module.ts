import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Route } from './entities/route.entity';
import { GeoCodeService } from './geocode.service';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  providers: [RouteService, GeoCodeService],
  controllers: [RouteController],
  exports: [RouteService, GeoCodeService],
  imports: [TypeOrmModule.forFeature([Route, Vehicle, User])],
})
export class RouteModule {}
