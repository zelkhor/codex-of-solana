import { HttpStatus } from '@nestjs/common';

const HTTP_STATUS_BY_ERROR_CODE: Record<string, HttpStatus> = {
  EMPTY_CLASS_NAME: HttpStatus.BAD_REQUEST,
  CARD_CATALOG_LOAD_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  CLASS_REPOSITORY_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
};

export const httpStatusForErrorCode = (code: string): HttpStatus =>
  HTTP_STATUS_BY_ERROR_CODE[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
