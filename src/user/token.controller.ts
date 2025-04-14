import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthGuard } from 'src/auth/auth.guard';
import { RequestUser } from 'src/auth/auth.service';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('/token')
export class TokenController {
  constructor(private readonly service: UserService) {}

  @Get('/')
  async findFromToken(
    @Req() req: Request & { user: RequestUser },
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const user = await this.service.findOneById(req.user.sub);

    if (user != null) {
      return res.send(user);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }
}
