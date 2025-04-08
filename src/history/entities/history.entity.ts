import { Rota } from 'src/rota/entities/rota.entity';
import { User } from 'src/user/entities/user.entity';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export type Coordinates = {
  lat: number;
  lng: number;
};

export enum HistoryStatus {
  PENDING = 0,
  APPROVED = 1,
  DISAPPROVED = 2,
}

@Entity('history')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  odometerInitial: number;

  @Column({ type: 'int' })
  odometerFinal: number;

  @Column({ type: 'varchar', length: 250 })
  observation: string;

  @Column({ type: 'enum', enum: HistoryStatus, default: HistoryStatus.PENDING })
  status: HistoryStatus;

  @Column({ type: 'decimal' })
  elapsedDistance: number;

  @Column({ type: 'varchar', nullable: false })
  imgOdometerInitial: string;

  @Column({ type: 'varchar', nullable: false })
  imgOdometerFinal: string;

  @Column('json', { nullable: false })
  pathCoordinates: {
    origin: Coordinates;
    destination: Coordinates;
    stops: Coordinates[];
  };

  @Column('json', { nullable: false })
  path: {
    origin: string;
    destination: string;
    stops: string[];
  };

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp' })
  endedAt: Date;

  @ManyToOne(() => Rota, (route) => route.id)
  route: Rota;

  @ManyToOne(() => User, (user) => user.id)
  driver: User;

  @ManyToOne(() => Veiculo, (vehicle) => vehicle.id)
  vehicle: Veiculo;
}
