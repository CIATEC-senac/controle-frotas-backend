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
import { VeiculoDTO } from './dtos/veiculo.dto';
import { Veiculo } from './entities/veiculo.entity';
import { VeiculoService } from './veiculo.service';

@Controller('veiculo')
export class VeiculoController {
  constructor(private readonly service: VeiculoService) {}

  @Get()
  findAll(): Promise<Veiculo[]> {
    return this.service.findAll();
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

  @Get(':id')
  async find(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const veiculo = await this.service.findOneBy(id);

    if (veiculo != null) {
      return res.send(veiculo);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @Patch()
  async update(@Body() veiculo: VeiculoDTO, @Res() res: Response) {
    try {
      const resultado = await this.service.update(veiculo.toEntity());
      res.status(HttpStatus.OK).json(resultado);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

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
