import type { AppError } from './errors';

export type Result<T, E extends AppError = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): { ok: true; value: T } => ({ ok: true, value });
export const err = <E extends AppError>(error: E): { ok: false; error: E } => ({
  ok: false,
  error,
});
