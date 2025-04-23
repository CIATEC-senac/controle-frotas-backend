import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestUser } from 'src/auth/auth.service';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { GcsService } from 'src/infrastructure/gcp/gcs';
import { UserDTO } from 'src/user/dtos/user.dto';
import { User, UserRole } from 'src/user/entities/user.entity';
import { HistoryApprovalDTO } from './dto/history.approval.dto';
import { CreateHistoryDTO, UpdateHistoryDTO } from './dto/history.dto';
import { HistoryUploadDTO } from './dto/history.upload.dto';
import { UnplannedStopDTO } from './dto/unplanned-stop.dto';
import { History } from './entities/history.entity';
import { HistoryService } from './history.service';

// Aplica os guards de autenticação e autorização a todo o controller
@UseGuards(AuthGuard, RolesGuard)
@Controller('history')
export class HistoryController {
  constructor(private readonly service: HistoryService) {}

  // Rota para listar todos os históricos e passando os cargos de quem tem acesso
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.DRIVER)
  @Get()
  // Se o usuário for DRIVER, limita a busca ao próprio usuário
  findAll(@Req() req: Request & { user: RequestUser }): Promise<History[]> {
    const userId = req.user.role == UserRole.DRIVER ? req.user.sub : null;

    return this.service.findAll(userId);
  }

  // Rota para buscar histórico por id
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

  // Rota para buscar histórico em andamento
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
    @Query('from') from?: Date,
    @Query('to') to?: Date,
  ) {
    return this.service.findByStatus(status, from, to);
  }

  // Rota para criar um novo histórico
  @Roles(UserRole.DRIVER)
  @Post()
  async create(
    @Body() history: CreateHistoryDTO,
    @Req() req: Request & { user: RequestUser },
    @Res() res: Response,
  ) {
    try {
      history.driver = new User();
      history.driver.id = req.user.sub;

      const result = await this.service.create(history);
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  // Rota para atualizar um histórico existente
  @Roles(UserRole.DRIVER)
  @Patch()
  async update(@Body() history: UpdateHistoryDTO, @Res() res: Response) {
    try {
      const result = await this.service.update(history);
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  // Rota para gerar uma URL assinada para upload de arquivos
  // Apenas o DRIVER pode usar
  @Roles(UserRole.DRIVER)
  @Post('upload/getSignedUrl')
  async getSignedUrl(@Body() upload: HistoryUploadDTO) {
    const signedUrl = await new GcsService().getSignedUrl(
      upload.fileName,
      upload.contentType,
    );

    return { signedUrl };
  }

  // Rota para atualização de status de um histórico (ex: aprovado ou reprovado)
  // Apenas o MANAGER pode usar
  @Post(':id/status')
  @Roles(UserRole.MANAGER)
  async updateStatus(
    @Param('id') id: number,
    @Body() approval: HistoryApprovalDTO,
    @Req() req: Request & { user: RequestUser },
    @Res() res: Response,
  ) {
    try {
      // Adiciona informações do aprovador e data à requisição
      approval.approvedBy = new UserDTO();
      approval.approvedBy.id = req.user.sub;

      approval.date = new Date();

      const result = await this.service.updateStatus(id, approval);
      res.status(HttpStatus.OK).json(result);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
  }

  @Post('ongoing/unplanned-stop')
  @Roles(UserRole.DRIVER)
  async addUnplannedStop(
    @Body() unplannedStop: UnplannedStopDTO,
    @Req() req: Request & { user: RequestUser },
  ) {
    return this.service.addUnplannedStop(req.user.sub, unplannedStop);
  }
}
