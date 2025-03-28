import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricoService } from './historico.service';
import { HistoricoController } from './historico.controller';
import { Historico } from './entities/historico.entity';
import { RotaModule } from 'src/rota/rota.module';

@Module({
  imports: [TypeOrmModule.forFeature([Historico]), RotaModule],
  providers: [HistoricoService],
  controllers: [HistoricoController],
  exports: [HistoricoService],
})
export class HistoricoModule {}
