import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { VeiculoService } from './veiculo/veiculo.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'debug', 'log', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000, () => {
    new Logger().log(`Servidor rodando na porta: ${process.env.PORT ?? 3000}`);
  });

  const userService = app.get(UserService);
  await userService.seed();

  const veiculoService = app.get(VeiculoService);
  await veiculoService.seed();
}

bootstrap();
