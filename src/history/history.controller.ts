import {
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  Res,
  Param,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { HistoryService } from './history.service';
import { HistoryDTO } from './dto/history.dto';
import { History, HistoryStatus } from './entities/history.entity';
import { GcsService } from 'src/infrastructure/gcp/gcs';
import { HistoryUploadDTO } from './dto/history.upload.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly service: HistoryService) {}

  @Get()
  findAll(): Promise<History[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async find(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const history = await this.service.findOne(id).catch(() => null);

    if (history != null) {
      return res.send(history);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @Post()
  async create(@Body() history: HistoryDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(history);
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  @Patch()
  async update(@Body() history: HistoryDTO, @Res() res: Response) {
    try {
      const result = await this.service.update(history);
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  @Post('upload/getSignedUrl')
  getSignedUrl(@Body() upload: HistoryUploadDTO) {
    return new GcsService().getSignedUrl(upload.fileName, upload.contentType);
  }

  @Post(':id/:status')
  async updateStatus(
    @Param('id') id: number,
    @Param('status') status: HistoryStatus,
    @Res() res: Response,
  ) {
    try {
      const result = await this.service.updateStatus(id, status);
      res.status(HttpStatus.OK).json(result);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }
}
