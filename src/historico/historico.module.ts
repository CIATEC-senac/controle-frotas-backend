import { Module } from '@nestjs/common';
import { HistoricoService } from './historico.service';
import { HistoricoController } from './historico.controller';
import { Historico } from './entities/historico.entity';
import { Rota } from 'src/rota/entities/rota.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({ 
    providers: [HistoricoService], 
    controllers: [HistoricoController],
    exports: [HistoricoService],
    imports: [TypeOrmModule.forFeature([Historico, Rota, User])]
})
export class HistoricoModule {}
