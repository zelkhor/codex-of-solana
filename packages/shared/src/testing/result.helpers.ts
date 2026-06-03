import type { Result } from '../helpers/result';
import type { AppError } from '../helpers/errors';

export function expectOk<T, E extends AppError>(
  r: Result<T, E>,
  expected?: T,
): asserts r is { ok: true; value: T } {
  expect(r.ok).toBe(true);

  if (r.ok) {
    if (expected !== undefined) {
      expect(r.value).toEqual(expected);
    }
  } else {
    fail(`Expected Ok, got Err: ${JSON.stringify(r.error)}`);
  }
}

export function expectErr<T, E extends AppError>(
  r: Result<T, E>,
  code?: string,
): asserts r is { ok: false; error: E } {
  expect(r.ok).toBe(false);

  if (!r.ok) {
    if (code !== undefined) {
      expect(r.error.code).toBe(code);
    }
  } else {
    fail(`Expected Err, got Ok with value: ${JSON.stringify(r.value)}`);
  }
}
