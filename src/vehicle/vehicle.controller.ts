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
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { VehicleDTO } from './dtos/vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleService } from './vehicle.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly service: VehicleService) {}

  // Busca todos os veículos
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(): Promise<Vehicle[]> {
    return this.service.findAll();
  }

  // Cria um novo veículo
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

  // Busca um veículos pelo id
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async find(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const vehicle = await this.service.findOneBy(id);

    // Verifica se o veículo é diferente de null e retorna um veículo
    if (vehicle != null) {
      return res.send(vehicle);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  // Atualiza um veículo
  @Roles(UserRole.ADMIN)
  @Patch()
  async update(@Body() vehicle: VehicleDTO, @Res() res: Response) {
    try {
      // Converte o DTO para a entidade e executa a atualização do veículo
      const resultado = await this.service.update(vehicle.toEntity());
      // Retorna o resultado da atualização com status OK (200)
      res.status(HttpStatus.OK).json(resultado);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  // Deleta um veículo pelo id
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    try {
      // Chama o serviço de delete para remover o veículo pelo id
      const resultado = await this.service.delete(id);
      // Retorna o resultado da deleção com status OK (200)
      res.status(HttpStatus.OK).json(resultado);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }
}
