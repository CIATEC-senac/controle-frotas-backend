import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MaintenanceType {
  CORRECTIVE = 0,
  PREVENTIVE = 1,
  PREDICTIVE = 2,
  SCHEDULED = 3,
}

@Entity('maintenance')
export class Maintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MaintenanceType,
    default: MaintenanceType.CORRECTIVE,
  })
  type: MaintenanceType;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.maintenances, {
    cascade: true,
  })
  @JoinTable()
  vehicles: Vehicle[];
}
