import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsDate,
  IsDefined,
} from 'class-validator';
import { Route } from 'src/route/entities/route.entity';
import { Coordinates, History } from '../entities/history.entity';
import { User } from 'src/user/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';

export class PathCoordinatesDTO {
  @IsOptional()
  origin: Coordinates;

  @IsOptional()
  destination: Coordinates;

  @IsOptional()
  stops: Coordinates[];
}

export class PathDTO {
  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsString({ each: true })
  stops: string[];
}

export class HistoryDTO {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  odometerInitial: number;

  @IsNumber()
  odometerFinal: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  elapsedDistance: number;

  @IsOptional()
  @IsString()
  imgOdometerInitial?: string;

  @IsOptional()
  @IsString()
  imgOdometerFinal?: string;

  pathCoordinates: PathCoordinatesDTO;

  @ValidateNested()
  path: PathDTO;

  @IsDate()
  startedAt: Date;

  @IsDate()
  endedAt: Date;

  @IsDefined()
  driver: User;

  @IsDefined()
  vehicle: Vehicle;

  @IsDefined()
  route: Route;

  toEntity(): History {
    const history = new History();

    history.odometerInitial = this.odometerInitial;
    history.odometerFinal = this.odometerFinal;
    history.elapsedDistance = this.elapsedDistance;
    history.imgOdometerInitial = this.imgOdometerInitial;
    history.imgOdometerFinal = this.imgOdometerFinal;
    history.pathCoordinates = this.pathCoordinates;
    history.path = this.path;
    history.startedAt = this.startedAt;
    history.endedAt = this.endedAt;

    history.driver = this.driver;
    history.vehicle = this.vehicle;
    history.route = this.route;
    history.approval = null;

    return history;
  }
}
