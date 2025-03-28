import {
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  Res,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { HistoricoService } from './historico.service';
import { HistoricoDto } from './dto/historico.dto';
import { Historico } from './entities/historico.entity';

@Controller('historico')
export class HistoricoController {
  constructor(private readonly service: HistoricoService) {}

  @Get()
  findAll(): Promise<Historico[]> {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() createHistoricoDto: HistoricoDto, @Res() res: Response) {
    try {
      const result = await this.service.create(createHistoricoDto);
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
    const historico = await this.service.findOne(id);

    if (historico != null) {
      return res.send(historico);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }
}
