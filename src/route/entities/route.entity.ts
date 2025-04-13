import { User } from 'src/user/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type Coordinate = {
  lat: number;
  lng: number;
};

export type RoutePath = {
  origin: string;
  destination: string;
  stops: string[];
};

export type RoutePathCoordinates = {
  origin: Coordinate;
  destination: Coordinate;
  stops: Coordinate[];
};

@Entity('route')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  estimatedDuration: number;

  @Column({ type: 'float', default: 0 })
  estimatedDistance: number;

  @Column('json', { nullable: false })
  path: RoutePath;

  @Column('json', { nullable: true })
  pathCoordinates: RoutePathCoordinates;

  @ManyToOne(() => Vehicle)
  @JoinColumn()
  vehicle: Vehicle;

  @ManyToOne(() => User)
  @JoinColumn()
  driver?: User;
}
