import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Route } from '../entities/route.entity';

export class PathDTO {
  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsString({ each: true })
  stops: string[];
}

export class RouteDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNumber()
  estimatedDuration: number;

  @IsNumber()
  elapsedTotal: number;

  @ValidateNested()
  path: PathDTO;

  @IsNumber()
  vehicle: number;

  @IsNumber()
  driver: number;

  toEntity(): Route {
    const route = new Route();
    route.id = this.id;
    route.estimatedDuration = this.estimatedDuration;
    route.elapsedDistance = this.elapsedTotal;
    route.path = this.path;

    route.vehicle = new Vehicle();
    route.vehicle.id = this.vehicle;

    route.driver = new User();
    route.driver.id = this.driver;

    route.estimatedDuration = 0;
    route.elapsedDistance = 0;

    return route;
  }
}
