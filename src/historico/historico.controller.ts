import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { HistoricoDTO } from './dto/historico.dto';
  import { Historico } from './entities/historico.entity'; 
  import { HistoricoService } from './historico.service'; 
  @Controller('historico')
  export class HistoricoController {
    constructor(private readonly service: HistoricoService) {}
  
    @Get()
    findAll(
      @Query('page') page: number,
      @Query('perPage') perPage: number,
    ): Promise<Historico[]> {
      return this.service.findAll(page, perPage || 10);
    }
  
    @Get(':id')
    async find(
      @Param('id') id: number,
      @Res() res: Response,
    ): Promise<Response<any, Record<string, any>>> {
      const historico = await this.service.findOneById(id);
  
      if (historico != null) {
        return res.send(historico);
      }
  
      return res.status(HttpStatus.NOT_FOUND).send();
    }
  
    @Post()
    async create(@Body() historicoDTO: HistoricoDTO, @Res() res: Response) {
      try {
        const result = await this.service.create(historicoDTO);
        res.status(HttpStatus.CREATED).json(result);
      } catch (e) {
        res.status(HttpStatus.CONFLICT).send(e.message);
      }
    }
  

  
  }
  