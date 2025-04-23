import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';

export enum HistoryStatus {
  APPROVED = 0,
  DISAPPROVED = 1,
}

@Entity('history_approval')
export class HistoryApproval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: HistoryStatus;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'varchar', length: 250, nullable: true })
  observation: string;

  @ManyToOne(() => User, (user) => user.id)
  approvedBy: User;
}
