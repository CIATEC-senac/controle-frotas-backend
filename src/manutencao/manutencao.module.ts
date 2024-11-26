import { Module } from '@nestjs/common';
import { ManutencaoService } from './manutencao.service';
import { ManutencaoController } from './manutencao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manutencao } from './entities/manutencao.entity';

@Module({
  providers: [ManutencaoService],
  controllers: [ManutencaoController],
  exports: [ManutencaoService],
  imports: [TypeOrmModule.forFeature([Manutencao])],
})
export class ManutencaoModule {}
