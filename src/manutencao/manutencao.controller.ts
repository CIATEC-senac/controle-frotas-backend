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
import { ManutencaoDTO } from './dtos/manutencao.dto';
import { Manutencao } from './entities/manutencao.entity';
import { ManutencaoService } from './manutencao.service';

@Controller('manutencao')
export class ManutencaoController {
  constructor(private readonly service: ManutencaoService) {}

  @Get()
  findAll(@Query('from') from: Date): Promise<Manutencao[]> {
    return this.service.findAll(from);
  }

  @Post()
  async create(@Body() manutencao: ManutencaoDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(manutencao.toEntity());
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
    const manutencao = await this.service.findOneBy(id);

    if (manutencao != null) {
      return res.send(manutencao);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @Patch()
  async update(@Body() manutencao: ManutencaoDTO, @Res() res: Response) {
    try {
      const resultado = await this.service.update(manutencao.toEntity());
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
