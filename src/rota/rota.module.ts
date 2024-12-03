import { Module } from '@nestjs/common';
import { RotaService } from './rota.service';
import { RotaController } from './rota.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rota } from './entities/rota.entity';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';

@Module({ 
    providers: [RotaService], 
    controllers: [RotaController],
    exports: [RotaService],
    imports: [TypeOrmModule.forFeature([Rota, Veiculo])]
})
export class RotaModule {}
