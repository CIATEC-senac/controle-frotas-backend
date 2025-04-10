import { Enterprise } from 'src/enterprise/entities/enterprise.entity';
import { Maintenance } from 'src/maintenance/entities/maintenance.entity';
import { Route } from 'src/route/entities/route.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
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
  type: VehicleType;

  @Column({ length: 30, nullable: true })
  model: string;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.id, {
    nullable: true,
  })
  enterprise: Enterprise;

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
