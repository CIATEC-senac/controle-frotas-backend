import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl: url } = request;

    const startTime = Date.now();

    response.on('close', () => {
      const { statusCode } = response;

      const contentLength = response.get('content-length');

      const decodedUrl = decodeURIComponent(url);
      const duration = Date.now() - startTime;

      this.logger.debug(
        `${method} ${decodedUrl} ${statusCode} ${contentLength} - ${duration}ms`,
      );
    });

    if (process.env.MOCK_TIMEOUT) {
      setTimeout(() => next(), Number(process.env.MOCK_TIMEOUT));
    } else {
      next();
    }
  }
}
