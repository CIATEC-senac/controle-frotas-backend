import { IsDefined, IsEnum } from 'class-validator';

import { Coordinate } from 'src/route/entities/route.entity';
import { UnplannedStopType } from '../entities/unplanned-stop.entity';

export class UnplannedStopDTO {
  @IsEnum(UnplannedStopType)
  type: UnplannedStopType;

  @IsDefined()
  coordinates: Coordinate;
}
