import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  // Cria uma instância do logger com a tag 'HTTP'
  private readonly logger = new Logger('HTTP');

  /**
   * Middleware que intercepta todas as requisições HTTP
   * para registrar informações úteis no console/log
   */
  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl: url } = request; // Captura método (GET, POST, etc.) e URL da requisição

    const startTime = Date.now(); // Marca o tempo inicial da requisição

    // Evento que é disparado quando a resposta é finalizada
    response.on('close', () => {
      const { statusCode } = response;

      const contentLength = response.get('content-length');

      const decodedUrl = decodeURIComponent(url); // Decodifica a URL (caso tenha caracteres especiais)
      const duration = Date.now() - startTime; // Tempo de execução da requisição em ms

      // Loga as informações formatadas
      this.logger.debug(
        `${method} ${decodedUrl} ${statusCode} ${contentLength} - ${duration}ms`,
      );
    });

    // Se houver um tempo de simulação de resposta, aplica o delay
    // if (process.env.MOCK_TIMEOUT) {
    //   setTimeout(() => next(), Number(process.env.MOCK_TIMEOUT));
    // } else {
    //   // Continua o fluxo normalmente
    //   next();
    // }

    next();
  }
}
