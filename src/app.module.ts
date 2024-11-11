import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { VeiculoController } from './veiculo/veiculo.controller';
import { VeiculoModule } from './veiculo/veiculo.module';
import { Veiculo } from './veiculo/entities/veiculo.entity';

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
  controllers: [VeiculoController],
})
export class AppModule {}
