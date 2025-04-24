import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from './notification.entity';

@Entity('notification_user')
export class NotificationUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Notification, (notification) => notification.users)
  notification: Notification;

  @Column({ type: 'bool', default: false })
  read: boolean;
}
