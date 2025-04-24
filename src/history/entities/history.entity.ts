import {
  Route,
  RoutePath,
  RoutePathCoordinates,
} from 'src/route/entities/route.entity';
import { User } from 'src/user/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HistoryApproval } from './history-approval.entity';

export type Coordinates = {
  lat: number;
  lng: number;
};

@Entity('history')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  odometerInitial: number;

  @Column({ type: 'int' })
  odometerFinal: number;

  @ManyToOne(() => HistoryApproval, (approval) => approval.id, {
    nullable: true,
  })
  approval: HistoryApproval;

  @Column({ type: 'decimal', nullable: true })
  elapsedDistance: number;

  @Column({ type: 'varchar', nullable: true })
  imgOdometerInitial: string;

  @Column({ type: 'varchar', nullable: true })
  imgOdometerFinal: string;

  @Column('json', { nullable: true })
  pathCoordinates: RoutePathCoordinates;

  @Column('json', { nullable: true })
  path: RoutePath;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @ManyToOne(() => Route, (route) => route.id)
  route: Route;

  @ManyToOne(() => User, (user) => user.id)
  driver: User;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  vehicle: Vehicle;
}
