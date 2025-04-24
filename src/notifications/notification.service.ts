import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDTO } from './dto/notification.dto';
import { NotificationUser } from './entities/notification-user.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationUser)
    private readonly notificationUserRepository: Repository<NotificationUser>,
  ) {}

  create(dto: CreateNotificationDTO) {
    const entity = dto.toEntity();

    return this.notificationRepository.save(entity);
  }

  async findByUser(userId: number) {
    const notifications = await this.notificationUserRepository.find({
      select: {
        notification: {
          id: true,
          date: true,
          message: true,
          link: true,
        },
      },
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        notification: true,
      },
      order: {
        notification: {
          date: 'DESC',
        },
      },
    });

    return notifications.map(({ read, id, notification }) => ({
      ...notification,
      read,
      id,
    }));
  }

  setRead(id: number, userId: number) {
    return this.notificationUserRepository.update(
      { id, user: { id: userId } },
      { read: true },
    );
  }
}
