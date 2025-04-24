import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthGuard } from 'src/auth/auth.guard';
import { RequestUser } from 'src/auth/auth.service';
import { NotificationService } from './notification.service';

@UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  async findByUser(
    @Req() req: Request & { user: RequestUser },
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.sub;

      return await this.service
        .findByUser(userId)
        .then((notifications) => res.status(HttpStatus.OK).json(notifications));
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  @Put('/read/:notificationId')
  async setRead(
    @Param('notificationId') notificationId: number,
    @Req() req: Request & { user: RequestUser },
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.sub;

      return await this.service
        .setRead(notificationId, userId)
        .then(() => res.status(HttpStatus.OK).send());
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }
}
