import { Module } from '@nestjs/common';
import { RotaService } from './rota.service';
import { RotaController } from './rota.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rota } from './entities/rota.entity';

@Module({ 
    providers: [RotaService],
    controllers: [RotaController],
    exports: [RotaService],
    imports: [TypeOrmModule.forFeature([Rota])]
})
export class RotaModule {}
