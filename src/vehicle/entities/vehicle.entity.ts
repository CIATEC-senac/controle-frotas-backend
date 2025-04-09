import { Maintenance } from 'src/maintenance/entities/maintenance.entity';
import { Route } from 'src/route/entities/route.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum VehicleType {
  CAR = 'carro',
  VAN = 'van',
  BUS = 'onibus',
  MINIBUS = 'minionibus',
}

@Entity('vehicle')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 7, unique: true })
  plate: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
    default: VehicleType.BUS,
  })
  model: VehicleType;

  @Column({ length: 100 })
  enterprise: string;

  @Column({ default: true })
  status: boolean;

  @Column()
  capacity: number;

  @Column()
  year: number;

  @Column({ length: 100 })
  site: string;

  @ManyToMany(() => Maintenance, (maintenance) => maintenance.vehicles)
  maintenances: Maintenance[];

  @OneToMany(() => Route, (route) => route.vehicle)
  routes: Route[];
}
