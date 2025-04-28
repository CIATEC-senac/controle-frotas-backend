import { Route } from 'src/route/entities/route.entity';
import { User } from 'src/user/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoryApproval } from './history-approval.entity';
import { HistoryTrack } from './history-track.entity';
import { UnplannedStop } from './unplanned-stop.entity';

@Entity('history')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  odometerInitial: number;

  @Column({ type: 'int', nullable: true })
  odometerFinal: number;

  @ManyToOne(() => HistoryApproval, (approval) => approval.id, {
    nullable: true,
  })
  approval: HistoryApproval;

  @Column({ type: 'varchar', nullable: true })
  imgOdometerInitial: string;

  @Column({ type: 'varchar', nullable: true })
  imgOdometerFinal: string;

  @OneToMany(() => HistoryTrack, (track) => track.history)
  track: HistoryTrack[];

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

  @OneToMany(() => UnplannedStop, (unplannedStop) => unplannedStop.history)
  unplannedStops: UnplannedStop[];
}
