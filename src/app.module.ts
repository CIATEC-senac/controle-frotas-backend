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
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
