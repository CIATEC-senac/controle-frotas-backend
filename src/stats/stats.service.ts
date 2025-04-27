import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { History } from 'src/history/entities/history.entity';
import { Repository } from 'typeorm';
import { StatsAggregation } from './dto/stats.dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(History)
    private readonly repository: Repository<History>,
  ) {}

  async getActiveVehiclesStats(): Promise<GenericStat[]> {
    const query = `
        SELECT sum(CASE WHEN "routes" > 0 THEN 1 ELSE 0 END) AS "activeCount",
            sum(CASE WHEN "routes" = 0 THEN 1 ELSE 0 END) AS "inactiveCount"
        FROM
        (SELECT v.id, count(r.id) AS "routes"
        FROM vehicle v
        LEFT JOIN route r ON r."vehicleId" = v.id
        GROUP BY v.id) 
    `;

    return this.repository.query(query);
  }

  async getOnGoingRoutesStats() {
    const query = `
        SELECT count(*)
        FROM "history"
        WHERE "startedAt" IS NOT NULL
        AND "endedAt" IS NULL
    `;

    return this.repository.query(query);
  }

  async getActiveDriversStats() {
    const query = `
      SELECT sum(CASE WHEN "routes" > 0 THEN 1 ELSE 0 END) AS "activeCount",
          sum(CASE WHEN "routes" = 0 THEN 1 ELSE 0 END) AS "inactiveCount"
      FROM
        (SELECT u.id,
              count(r.id) AS "routes"
        FROM "user" u
        LEFT JOIN route r ON r."driverId" = u.id
        WHERE u.role = '2'
        GROUP BY u.id)
      `;

    return this.repository.query(query);
  }

  async getElapsedDistanceStats() {
    const from = dayjs().startOf('month').toDate();
    const to = dayjs().endOf('month').toDate();

    const previousFrom = dayjs(from).subtract(1, 'month').toDate();
    const previousTo = dayjs(to).subtract(1, 'month').toDate();

    const query = `
      SELECT sum("odometerFinal" - "odometerInitial") AS "distance"
      FROM history h
      WHERE "startedAt" >= $1
        AND "startedAt" < $2
      UNION
      SELECT sum("odometerFinal" - "odometerInitial") AS "distance"
      FROM history h
      WHERE "startedAt" >= $3
        AND "startedAt" < $4
      `;

    return this.repository.query(query, [from, to, previousFrom, previousTo]);
  }

  async getRecentHistoriesStats(): Promise<RecentHistoryStat[]> {
    const from = dayjs().startOf('day').toDate();

    const query = `
      SELECT h.id AS "route",
        u.name AS "driver",
        sum(h."odometerFinal" - h."odometerInitial") AS "distance",
        EXTRACT(EPOCH FROM(h."endedAt" - h."startedAt")) / 60 AS "duration"
      FROM history h
      JOIN "user" u ON u.id = h."driverId"
      WHERE "endedAt" >= $1
      GROUP BY h.id,
               u.name
      ORDER BY h."endedAt" DESC
      `;

    return this.repository
      .query(query, [from])
      .then((result: RecentHistoryStat[]) =>
        result.map(
          (history) =>
            ({
              route: history.route,
              driver: history.driver,
              distance: history.distance
                ? Number(Number(history.distance).toFixed(2))
                : 0,
              duration: history.duration
                ? Number(Number(history.duration).toFixed(2))
                : 0,
            }) as RecentHistoryStat,
        ),
      );
  }

  async getDriversPerformance(
    from: Date,
    to: Date,
    aggregation: StatsAggregation,
  ) {
    const dateAggregation = this.getDateAggregation(aggregation);

    const query = `
      SELECT "date", json_object_agg("name", "distance") AS "values"
      FROM 
        (SELECT date(date_trunc($1, h."endedAt")) AS "date",
          h."driverId", u.name,
          sum("odometerFinal" - "odometerInitial") AS distance
      FROM history h
      JOIN "user" u ON h."driverId" = u.id
      WHERE h."endedAt" BETWEEN $2 AND $3
      GROUP BY h."driverId", u.name, h."endedAt") t
      GROUP BY "date"
      ORDER BY "date"
      `;

    return this.repository.query(query, [dateAggregation, from, to]);
  }

  async getMaintenancesPerVehicle(
    from: Date,
    to: Date,
    aggregation: StatsAggregation,
  ) {
    const dateAggregation = this.getDateAggregation(aggregation);

    const query = `
      SELECT "date",
        json_object_agg("model", "count") AS "values"
      FROM
        (SELECT v.model,
            date(date_trunc($1, m."date")) AS "date",
            count(v.id)
      FROM vehicle v
      JOIN maintenance_vehicles_vehicle mv ON v.id = mv."vehicleId"
      JOIN maintenance m ON mv."maintenanceId" = m.id
      WHERE m."date" BETWEEN $2 AND $3
      GROUP BY v.model,
                date(date_trunc($1, m."date"))) t
      GROUP BY "date"
      ORDER BY "date"
      `;

    return this.repository.query(query, [dateAggregation, from, to]);
  }

  async getMaintenancesPerType(
    from: Date,
    to: Date,
    aggregation: StatsAggregation,
  ) {
    const dateAggregation = this.getDateAggregation(aggregation);

    const query = `
      SELECT "date",
        json_object_agg("type", "count") AS "values"
      FROM
      (SELECT m."type",
              date(date_trunc($1, m."date")) AS "date",
              count(mv."vehicleId")
      FROM maintenance m
      JOIN maintenance_vehicles_vehicle mv ON m.id = mv."maintenanceId"
      WHERE m."date" BETWEEN $2 AND $3
      GROUP BY m."type",
                date(date_trunc($1, m."date"))) t
      GROUP BY "date"
      ORDER BY "date"
      `;

    return this.repository.query(query, [dateAggregation, from, to]);
  }

  getDateAggregation(aggregation: StatsAggregation) {
    switch (aggregation) {
      case StatsAggregation.weekly:
        return 'week';
      case StatsAggregation.daily:
        return 'day';
      case StatsAggregation.monthly:
        return 'month';
    }
  }
}

export type GenericStat = {
  activeCount: number;
  inactiveCount?: number;
  diff?: number;
};

export type RecentHistoryStat = {
  driver: string;
  route: number;
  duration?: number;
  distance?: number;
};
