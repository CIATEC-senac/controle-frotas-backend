import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Coordinate } from 'src/route/entities/route.entity';
import { History } from './history.entity';

@Entity()
export class HistoryTrack {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  coordinate: Coordinate;

  @ManyToOne(() => History, (history) => history.track, { cascade: true })
  history: History;
}
