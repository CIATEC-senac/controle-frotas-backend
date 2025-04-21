import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { RouteDTO } from './dtos/route.dto';
import { Route } from './entities/route.entity';
import { RouteService as RouteService } from './route.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

//@UseGuards(AuthGuard, RolesGuard)
@Controller('route')
export class RouteController {
  constructor(private readonly service: RouteService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(): Promise<Route[]> {
    return this.service.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() route: RouteDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(route);
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  @Roles(UserRole.ADMIN, UserRole.DRIVER)
  @Get(':id')
  async find(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const route = await this.service.findOneById(id);

    if (route != null) {
      return res.send(route);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @Roles(UserRole.ADMIN)
  @Patch()
  async update(@Body() route: RouteDTO, @Res() res: Response) {
    try {
      const result = await this.service.update(route);
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
