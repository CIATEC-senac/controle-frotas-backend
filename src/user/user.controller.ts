import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserDTO } from './dtos/user.dto';
import { User, UserRole } from './entities/user.entity';
import { UserService } from './user.service';
import { Roles } from 'src/auth/roles.decorator';
import { RequestUser } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  findAll(): Promise<User[]> {
    return this.service.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get('/:id')
  async find(
    @Param('id') id: number,
    @Req() req: Request & { user: RequestUser },
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const user = await this.service.findOneById(id);

    if (user != null) {
      return res.send(user);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() user: UserDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(user.toEntity());
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  @Roles(UserRole.ADMIN)
  @Patch()
  async update(@Body() user: UserDTO, @Res() res: Response) {
    try {
      const result = await this.service.update(user.toEntity());
      res.status(HttpStatus.OK).json(result);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    try {
      const result = await this.service.delete(id);
      res.status(HttpStatus.OK).json(result);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }
}
