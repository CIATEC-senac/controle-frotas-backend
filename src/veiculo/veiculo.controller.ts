import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  Delete,
  Patch,
  Param,
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
  async create(@Body() veiculo:VeiculoDTO, @Res() res:Response) {
    try {
      const result = await this.service.create(veiculo.toEntity());
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  @Get(':placa')
  async find(
    @Param('placa') placa:string,
    @Res() res:Response,
  ): Promise<Response<any, Record<string, any>>> {
    const veiculo= await this.service.findOneBy(placa);

    if (veiculo!= null) {
      return res.send(veiculo);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @Patch()
  async update(@Body() veiculo:VeiculoDTO, @Res() res:Response) {
    try {
      const resultado = await this.service.update(veiculo.toEntity());
      res.status(HttpStatus.OK).json(resultado);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  @Delete(':placa')
  async delete(@Param('placa') placa:string, @Res() res:Response) {
    try {
      const resultado = await this.service.delete(placa);
      res.status(HttpStatus.OK).json(resultado);
    } catch(e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }


}

