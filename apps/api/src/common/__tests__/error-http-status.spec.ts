import { HttpStatus } from '@nestjs/common';
import { describe, expect, test } from 'vitest';

import { httpStatusForErrorCode } from '../error-http-status';

describe('Translating domain errors into HTTP responses', () => {
  test('An empty class name is rejected as a bad request', () => {
    expect(httpStatusForErrorCode('EMPTY_CLASS_NAME')).toBe(HttpStatus.BAD_REQUEST);
  });

  test('A failure to load the card catalog is reported as a server error', () => {
    expect(httpStatusForErrorCode('CARD_CATALOG_LOAD_ERROR')).toBe(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });

  test('An unrecognised error falls back to a server error', () => {
    expect(httpStatusForErrorCode('SOMETHING_UNEXPECTED')).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
