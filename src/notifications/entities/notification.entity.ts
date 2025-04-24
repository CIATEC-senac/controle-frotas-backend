import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { NotificationUser } from './notification-user.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'varchar', nullable: true })
  link: string;

  @Column({ type: 'timestamp', default: 'NOW()' })
  date: Date;

  @OneToMany(() => NotificationUser, (user) => user.notification, {
    cascade: true,
  })
  users: NotificationUser[];
}
