import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserDTO } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<User[]> {
    return this.service.findAll(page, perPage || 10);
  }

  @Get(':id')
  async find(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const user = await this.service.findOneById(id);

    if (user != null) {
      return res.send(user);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @Post()
  async create(@Body() user: UserDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(user.toEntity());
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }
}