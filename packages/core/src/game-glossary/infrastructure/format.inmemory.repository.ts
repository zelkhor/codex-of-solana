import { type Result, ok } from '../../shared/helpers/result';
import type { IFormatRepository } from '../application/format.repository';
import type { Format } from '../domain/format';

export class InMemoryFormatRepository implements IFormatRepository {
  private formats = new Map<string, Format>();

  setFormats(formats: Format[]): this {
    this.formats = new Map(formats.map((format) => [format.name, format]));
    return this;
  }

  async findAll(): Promise<Result<Format[]>> {
    return ok([...this.formats.values()]);
  }

  async saveAll(formats: Format[]): Promise<Result<void>> {
    formats.forEach((format) => this.formats.set(format.name, format));
    return ok(undefined);
  }
}
