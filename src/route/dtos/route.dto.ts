import {
  IsDefined,
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

  @IsOptional()
  @IsNumber()
  estimatedDuration: number = 0;

  @IsOptional()
  @IsNumber()
  estimatedDistance: number = 0;

  @ValidateNested()
  path: PathDTO;

  @IsDefined()
  vehicle: Vehicle;

  @IsDefined()
  driver: User;

  toEntity(): Route {
    const route = new Route();
    route.id = this.id;
    route.path = this.path;
    route.vehicle = this.vehicle;
    route.driver = this.driver;
    route.estimatedDuration = 0;
    route.estimatedDistance = 0;

    return route;
  }
}
