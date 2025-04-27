import { Controller, Get, Query } from '@nestjs/common';

import { StatsDto } from './dto/stats.dto';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly service: StatsService) {}

  @Get('active-vehicles')
  async getActiveVehiclesStats() {
    return this.service.getActiveVehiclesStats().then((result) => result.at(0));
  }

  @Get('ongoing-routes')
  async getOnGoingRoutesStats() {
    return this.service.getOnGoingRoutesStats().then((result) => result.at(0));
  }

  @Get('active-drivers')
  async getActiveDriversStats() {
    return this.service.getActiveDriversStats().then((result) => result.at(0));
  }

  @Get('elapsed-distance')
  async getElapsedDistanceStats() {
    return this.service.getElapsedDistanceStats().then((result) => {
      const currentMonth = Number(result.at(0).distance);
      const latestMonth = Number(result.at(1).distance);

      const diff = (currentMonth * 100) / latestMonth;

      return {
        total: currentMonth,
        diff: diff,
      };
    });
  }

  @Get('recent-histories')
  async getRecentHistoriesStats() {
    return this.service.getRecentHistoriesStats();
  }

  @Get('drivers-performance')
  async getDriversPerformance(@Query() dto: StatsDto) {
    return this.service.getDriversPerformance(
      dto.from,
      dto.to,
      dto.aggregation,
    );
  }

  @Get('maintenances-vehicles')
  async getMaintenancesPerVehicle(@Query() dto: StatsDto) {
    return this.service.getMaintenancesPerVehicle(
      dto.from,
      dto.to,
      dto.aggregation,
    );
  }

  @Get('maintenances-types')
  async getMaintenancesPerTypes(@Query() dto: StatsDto) {
    return this.service.getMaintenancesPerType(
      dto.from,
      dto.to,
      dto.aggregation,
    );
  }
}
