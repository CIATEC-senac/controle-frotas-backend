import {
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Route } from 'src/route/entities/route.entity';
import { User } from 'src/user/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Coordinates, History } from '../entities/history.entity';

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

export class CreateHistoryDTO {
  @IsNumber()
  odometerInitial: number;

  @IsString()
  imgOdometerInitial?: string;

  @IsDate()
  startedAt: Date;

  @IsDefined()
  driver: User;

  @IsDefined()
  vehicle: Vehicle;

  @IsDefined()
  route: Route;

  toEntity(): History {
    const history = new History();

    history.odometerInitial = this.odometerInitial;
    history.imgOdometerInitial = this.imgOdometerInitial;
    history.startedAt = this.startedAt;

    history.driver = this.driver;
    history.vehicle = this.vehicle;
    history.route = this.route;

    return history;
  }
}

export class HistoryDTO {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  odometerInitial: number;

  @IsString()
  imgOdometerInitial?: string;

  @IsDefined()
  driver: User;

  @IsDefined()
  vehicle: Vehicle;

  @IsDefined()
  route: Route;

  toEntity(): History {
    const history = new History();

    history.odometerInitial = this.odometerInitial;
    history.imgOdometerInitial = this.imgOdometerInitial;

    history.driver = this.driver;
    history.vehicle = this.vehicle;
    history.route = this.route;

    return history;
  }
}

export class UpdateHistoryDTO {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  odometerInitial?: number;

  @IsOptional()
  @IsNumber()
  odometerFinal?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  elapsedDistance?: number;

  @IsOptional()
  @IsString()
  imgOdometerInitial?: string;

  @IsOptional()
  @IsString()
  imgOdometerFinal?: string;

  @IsOptional()
  pathCoordinates?: PathCoordinatesDTO;

  @IsOptional()
  @ValidateNested()
  path?: PathDTO;

  @IsOptional()
  @IsDate()
  startedAt?: Date;

  @IsOptional()
  @IsDate()
  endedAt?: Date;

  toEntity(): History {
    const history = new History();

    if (this.odometerInitial != null)
      history.odometerInitial = this.odometerInitial;

    if (this.odometerFinal != null) history.odometerFinal = this.odometerFinal;

    if (this.imgOdometerInitial != null)
      history.imgOdometerInitial = this.imgOdometerInitial;

    if (this.imgOdometerFinal != null)
      history.imgOdometerFinal = this.imgOdometerFinal;

    if (this.pathCoordinates != null)
      history.pathCoordinates = this.pathCoordinates;

    if (this.path != null) history.path = this.path;

    if (this.startedAt != null) history.startedAt = this.startedAt;

    if (this.endedAt != null) history.endedAt = this.endedAt;

    return history;
  }
}
