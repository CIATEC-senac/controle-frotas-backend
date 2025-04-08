import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'debug', 'log', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000, () => {
    new Logger().log(`Servidor rodando na porta: ${process.env.PORT ?? 3000}`);
  });
}

bootstrap();
