import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserDTO } from 'src/user/dtos/user.dto';
import { VehicleDTO } from 'src/vehicle/dtos/vehicle.dto';
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

  @IsString()
  startAt: string;

  @ValidateNested()
  path: PathDTO;

  @IsDefined()
  vehicle: VehicleDTO;

  @IsDefined()
  driver: UserDTO;

  toEntity(): Route {
    const route = new Route();
    route.id = this.id;
    route.path = this.path;
    route.startAt = this.startAt;
    route.vehicle = this.vehicle.toEntity();
    route.driver = this.driver.toEntity();
    route.estimatedDuration = 0;
    route.estimatedDistance = 0;

    return route;
  }
}
