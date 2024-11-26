import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppLoggerMiddleware } from './lib/middlewares/applogger';
import { User } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { Veiculo } from './veiculo/entities/veiculo.entity';
import { VeiculoController } from './veiculo/veiculo.controller';
import { VeiculoModule } from './veiculo/veiculo.module';
import { ManutencaoController } from './manutencao/manutencao.controller';
import { ManutencaoModule } from './manutencao/manutencao.module';
import { Manutencao } from './manutencao/entities/manutencao.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database', // Nome do serviço do PostgreSQL no docker-compose.yml
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'frotas',
      entities: [User, Veiculo, Manutencao],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    VeiculoModule,
    ManutencaoModule,
  ],
  controllers: [VeiculoController, UserController, ManutencaoController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppLoggerMiddleware)
      .forRoutes('user', 'veiculo', 'manutencao');
  }
}
