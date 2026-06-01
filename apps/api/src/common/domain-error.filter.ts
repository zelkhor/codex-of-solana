import { type ArgumentsHost, Catch, type ExceptionFilter, HttpStatus } from '@nestjs/common';
import { AppError } from '@codex/shared';
import type { Response } from 'express';

@Catch(AppError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: AppError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: error.code,
      message: error.message,
    });
  }
}
