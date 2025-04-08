import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  IsDate,
  IsDefined,
} from 'class-validator';
import { Rota } from 'src/rota/entities/rota.entity';
import {
  Coordinates,
  History,
  HistoryStatus,
} from '../entities/history.entity';
import { User } from 'src/user/entities/user.entity';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';

export class PathCoordinatesDTO {
  @IsOptional()
  @ValidateNested()
  origin: Coordinates;

  @IsOptional()
  @ValidateNested()
  destination: Coordinates;

  @IsOptional()
  @ValidateNested({ each: true })
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
  @IsNumber()
  odometerInitial: number;

  @IsNumber()
  odometerFinal: number;

  @IsString()
  observation: string;

  @IsEnum(HistoryStatus)
  status: HistoryStatus;

  @IsNumber({ maxDecimalPlaces: 2 })
  elapsedDistance: number;

  @IsOptional()
  @IsString()
  imgOdometerInitial?: string;

  @IsOptional()
  @IsString()
  imgOdometerFinal?: string;

  @ValidateNested()
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
  vehicle: Veiculo;

  @IsDefined()
  route: Rota;

  toEntity(): History {
    const history = new History();

    history.odometerInitial = this.odometerInitial;
    history.odometerFinal = this.odometerFinal;
    history.observation = this.observation;
    history.status = this.status;
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

    return history;
  }
}
