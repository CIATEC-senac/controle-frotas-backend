import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { EnterpriseService } from './enterprise.service';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { Enterprise } from './entities/enterprise.entity';
import { EnterpriseDTO } from './dtos/enterprise.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly service: EnterpriseService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(): Promise<Enterprise[]> {
    return this.service.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() vehicle: EnterpriseDTO, @Res() res: Response) {
    try {
      const result = await this.service.create(vehicle.toEntity());
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }

  @Roles(UserRole.ADMIN)
  @Patch()
  async update(@Body() vehicle: EnterpriseDTO, @Res() res: Response) {
    try {
      const result = await this.service.update(vehicle.toEntity());
      res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      res.status(HttpStatus.CONFLICT).send(e.message);
    }
  }
}
