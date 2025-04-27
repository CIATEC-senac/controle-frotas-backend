import { IsDate, IsEnum, IsOptional } from 'class-validator';

export enum StatsAggregation {
  weekly = 'weekly',
  daily = 'daily',
  monthly = 'monthly',
}

export class StatsDto {
  @IsDate()
  from: Date;

  @IsDate()
  to: Date;

  @IsOptional()
  @IsEnum(StatsAggregation)
  aggregation: StatsAggregation = StatsAggregation.monthly;
}
