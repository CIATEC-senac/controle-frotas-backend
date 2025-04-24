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

  findByUser(userId: number) {
    return this.notificationRepository.find({
      select: {
        date: true,
        id: true,
        message: true,
        link: true,
      },
      where: {
        users: {
          id: userId,
        },
      },
      order: {
        date: 'DESC',
      },
    });
  }

  setRead(id: number, userId: number) {
    return this.notificationUserRepository.update(
      { read: true },
      { id, user: { id: userId } },
    );
  }
}
