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
} from '@nestjs/common';
import { Response } from 'express';
import { RouteDTO } from './dtos/route.dto';
import { Route } from './entities/route.entity';
import { RouteService as RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private readonly service: RouteService) {}

  @Get()
  findAll(): Promise<Route[]> {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() route: RouteDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(route);
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

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

  @Patch()
  async update(@Body() route: RouteDTO, @Res() res: Response) {
    try {
      const result = await this.service.update(route);
      res.status(HttpStatus.OK).json(result);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

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
