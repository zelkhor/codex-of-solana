import type { Result } from '../../shared/helpers/result';
import type { Format } from '../domain/format';

export interface IFormatRepository {
  findAll(): Promise<Result<Format[]>>;
  saveAll(formats: Format[]): Promise<Result<void>>;
}
