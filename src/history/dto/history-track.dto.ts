import { IsDefined } from 'class-validator';
import { Coordinate } from 'src/route/entities/route.entity';

export class HistoryTrackDTO {
  @IsDefined()
  coordinate: Coordinate;
}
