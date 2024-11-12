import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { VeiculoService } from './veiculo/veiculo.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);

  const userService = app.get(UserService);
  await userService.seed();

  const veiculoService = app.get(VeiculoService);
  await veiculoService.seed();
}

bootstrap();
