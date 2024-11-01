import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserDTO } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() user: UserDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(await user.toEntity());
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }
}
