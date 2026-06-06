import { type ArgumentsHost, Catch, type ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

import { AppError } from '@codex/core';

@Catch(AppError)
export class HttpError implements ExceptionFilter {
  catch(error: AppError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: error.code,
      message: error.message,
    });
  }
}
