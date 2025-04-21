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
import { VehicleDTO } from './dtos/vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleService } from './vehicle.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

//@UseGuards(AuthGuard, RolesGuard)
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly service: VehicleService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(): Promise<Vehicle[]> {
    return this.service.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() vehicle: VehicleDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(vehicle.toEntity());
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  async find(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const vehicle = await this.service.findOneBy(id);

    if (vehicle != null) {
      return res.send(vehicle);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @Roles(UserRole.ADMIN)
  @Patch()
  async update(@Body() vehicle: VehicleDTO, @Res() res: Response) {
    try {
      const resultado = await this.service.update(vehicle.toEntity());
      res.status(HttpStatus.OK).json(resultado);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    try {
      const resultado = await this.service.delete(id);
      res.status(HttpStatus.OK).json(resultado);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }
}
