import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { VeiculoDTO } from './dtos/veiculo.dto';
import { Veiculo } from './entities/veiculo.entity';
import { VeiculoService } from './veiculo.service';

@Controller('veiculo')
export class VeiculoController {
  constructor(private readonly service: VeiculoService) {}

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<Veiculo[]> {
    return this.service.findAll(page, perPage || 10);
  }

  @Post()
  async create(@Body() veiculo: VeiculoDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(veiculo.toEntity());
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }
}
