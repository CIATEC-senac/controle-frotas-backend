import { Module } from '@nestjs/common';
import { VeiculoService } from './veiculo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veiculo } from './entities/veiculo.entity';
import { VeiculoController} from './veiculo.controller'


@Module({
  providers: [VeiculoService],
  controllers: [VeiculoController],
  exports: [VeiculoService],
  imports: [TypeOrmModule.forFeature([Veiculo]),]
})
export class VeiculoModule {}
