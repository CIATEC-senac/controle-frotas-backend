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
  import { RotaDTO } from './dtos/rota.dto';
  import { Rota } from './entities/rota.entity';
  import { RotaService } from './rota.service';
  
  @Controller('rota')
  export class RotaController {
    constructor(private readonly service: RotaService) {}

    @Get()
    findAll (
      @Query('page') page: number,
      @Query('perPage') perPage: number,
    ): Promise<Rota[]> {
      return this.service.findAll(page, perPage || 10);
    }

  @Get(':id/json')
  async getRotaJson(@Param('id') id: number, @Res() res: Response) {
    const rota = await this.service.findOneById(id);
    if (rota && rota.rotaJson) {
      return res.json(rota.rotaJson);
    }
    return res.status(HttpStatus.NOT_FOUND).send('Rota ou JSON não encontrado');
  }

    @Post()
    async create(@Body() rota: RotaDTO, @Res() res: Response) {
      try {
        const result = await this.service.create(rota);
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
      const rota = await this.service.findOneById(id);
  
      if (rota != null) {
        return res.send(rota);
      }
  
      return res.status(HttpStatus.NOT_FOUND).send();
    }
  
    @Patch(':id')
    async update(@Param('id') id: number, @Body() rota: RotaDTO, @Res() res: Response) {
      try {
        const resultado = await this.service.update(rota.toEntity());
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
  