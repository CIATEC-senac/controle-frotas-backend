import {
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  Res,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HistoryService } from './history.service';
import { HistoryDTO } from './dto/history.dto';
import { GcsService } from 'src/infrastructure/gcp/gcs';
import { HistoryUploadDTO } from './dto/history.upload.dto';
import { History } from './entities/history.entity';
import { HistoryApprovalDTO } from './dto/history.approval.dto';
import { RequestUser } from 'src/auth/auth.service';
import { UserDTO } from 'src/user/dtos/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@UseGuards(AuthGuard, RolesGuard)
@Controller('history')
export class HistoryController {
  constructor(private readonly service: HistoryService) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.DRIVER)
  @Get()
  findAll(@Req() req: Request & { user: RequestUser }): Promise<History[]> {
    const userId = req.user.role == UserRole.DRIVER ? req.user.sub : null;

    return this.service.findAll(userId);
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
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

  @Roles(UserRole.DRIVER)
  @Post()
  async create(@Body() history: HistoryDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(history);
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  @Roles(UserRole.DRIVER)
  @Patch()
  async update(@Body() history: HistoryDTO, @Res() res: Response) {
    try {
      const result = await this.service.update(history);
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  @Roles(UserRole.DRIVER)
  @Post('upload/getSignedUrl')
  getSignedUrl(@Body() upload: HistoryUploadDTO) {
    return new GcsService().getSignedUrl(upload.fileName, upload.contentType);
  }

  @Post(':id/:status')
  @Post(':id')
  @Roles(UserRole.MANAGER)
  async updateStatus(
    @Param('id') id: number,
    @Body() approval: HistoryApprovalDTO,
    @Req() req: Request & { user: RequestUser },
    @Res() res: Response,
  ) {
    try {
      approval.approvedBy = new UserDTO();
      approval.approvedBy.id = req.user.sub;

      approval.date = new Date();

      const result = await this.service.updateStatus(id, approval);
      res.status(HttpStatus.OK).json(result);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }
}
