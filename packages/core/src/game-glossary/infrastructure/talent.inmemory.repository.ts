import { type Result, ok } from '../../shared/helpers/result';
import type { ITalentRepository } from '../application/talent.repository';
import type { Talent } from '../domain/talent';

export class InMemoryTalentRepository implements ITalentRepository {
  private talents = new Map<string, Talent>();

  setTalents(talents: Talent[]): this {
    this.talents = new Map(talents.map((talent) => [talent.name, talent]));
    return this;
  }

  async findAll(): Promise<Result<Talent[]>> {
    return ok([...this.talents.values()]);
  }

  async saveAll(talents: Talent[]): Promise<Result<void>> {
    talents.forEach((talent) => this.talents.set(talent.name, talent));
    return ok(undefined);
  }
}
