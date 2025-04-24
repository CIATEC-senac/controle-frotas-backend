import { IsDefined, IsOptional, IsString } from 'class-validator';

import { User } from 'src/user/entities/user.entity';
import { NotificationUser } from '../entities/notification-user.entity';
import { Notification } from '../entities/notification.entity';

export class CreateNotificationDTO {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  link: string;

  @IsDefined()
  users: number[];

  toEntity(): Notification {
    const entity = new Notification();

    entity.message = this.message;
    entity.link = this.link;

    entity.users = this.users.map((user) => {
      const entity = new NotificationUser();

      entity.user = new User();
      entity.user.id = user;

      return entity;
    });

    return entity;
  }
}
