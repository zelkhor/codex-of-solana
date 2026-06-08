import { type ArgumentsHost, Catch, type ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';

import { AppError } from '@codex/core';

import { httpStatusForErrorCode } from './error-http-status';

@Catch(AppError)
export class HttpError implements ExceptionFilter {
  catch(error: AppError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(httpStatusForErrorCode(error.code)).json({
      code: error.code,
      message: error.message,
    });
  }
}
