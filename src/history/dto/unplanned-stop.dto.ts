import { IsDefined, IsEnum, IsOptional } from 'class-validator';
import { Coordinate } from 'src/route/entities/route.entity';
import { History } from '../entities/history.entity';
import {
  UnplannedStop,
  UnplannedStopType,
} from '../entities/unplanned-stop.entity';

export class UnplannedStopDTO {
  @IsEnum(UnplannedStopType)
  type: UnplannedStopType;

  @IsDefined()
  coordinates: Coordinate;

  @IsOptional()
  history: History;

  toEntity() {
    const entity = new UnplannedStop();
    entity.coordinates = this.coordinates;
    entity.type = this.type;
    entity.history = this.history;

    return entity;
  }
}
