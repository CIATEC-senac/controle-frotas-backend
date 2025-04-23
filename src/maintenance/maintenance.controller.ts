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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { MaintenanceDTO } from './dtos/maintenance.dto';
import { Maintenance } from './entities/maintenance.entity';
import { MaintenanceService } from './maintenance.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}

  // Lista todas as manutenções a partir de uma data
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('from') from: Date): Promise<Maintenance[]> {
    return this.service.findAll(from);
  }

  // Cria um novo registro de manutenção
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() maintenance: MaintenanceDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(maintenance.toEntity());
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  // Busca uma manutenção específica pelo id
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async find(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const maintenance = await this.service.findOneBy(id);

    if (maintenance != null) {
      return res.send(maintenance); // Retorna a manutenção encontrada
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  // Atualiza uma manutenção
  @Roles(UserRole.ADMIN)
  @Patch()
  async update(@Body() maintenance: MaintenanceDTO, @Res() res: Response) {
    try {
      const resultado = await this.service.update(maintenance.toEntity());
      res.status(HttpStatus.OK).json(resultado);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  // Remove uma manutenção
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
