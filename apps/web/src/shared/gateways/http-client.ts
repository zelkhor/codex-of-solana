import { type Result, ok, err, AppError } from '@codex/core';

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string): Promise<Result<T, AppError>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`);
      if (!response.ok)
        return err(new AppError('HTTP_ERROR', `Request failed with status ${response.status}`));
      return ok((await response.json()) as T);
    } catch (e) {
      return err(new AppError('NETWORK_ERROR', e instanceof Error ? e.message : 'Network error'));
    }
  }
}
