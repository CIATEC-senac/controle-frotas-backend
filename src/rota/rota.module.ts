import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';
import { Rota } from './entities/rota.entity';
import { GeoCodeService } from './geocode.service';
import { RotaController } from './rota.controller';
import { RotaService } from './rota.service';

@Module({
  providers: [RotaService, GeoCodeService],
  controllers: [RotaController],
  exports: [RotaService, GeoCodeService],
  imports: [TypeOrmModule.forFeature([Rota, Veiculo, User])],
})
export class RotaModule {}
