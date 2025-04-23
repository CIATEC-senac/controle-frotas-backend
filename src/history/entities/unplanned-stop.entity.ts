import { Coordinate } from 'src/route/entities/route.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { History } from './history.entity';

export enum UnplannedStopType {
  traffic = 0,
  closedRoad = 1,
  blockedLane = 2,
  gas = 3,
  mechanicalProblem = 4,
  accident = 5,
}

@Entity('unplanned_stop')
export class UnplannedStop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UnplannedStopType,
    default: UnplannedStopType.traffic,
  })
  type: UnplannedStopType;

  @Column('json', { nullable: true })
  coordinates: Coordinate;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => History, (history) => history.id)
  history: History;
}
