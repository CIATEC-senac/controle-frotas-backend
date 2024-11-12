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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'frotas',
      entities: [User, Veiculo],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    VeiculoModule,
  ],
  controllers: [VeiculoController, UserController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('user', 'veiculo');
  }
}
