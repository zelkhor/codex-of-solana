import { type Result, ok } from '../../shared/helpers/result';
import type { ITreatmentRepository } from '../application/treatment.repository';
import type { Treatment } from '../domain/treatment';

export class InMemoryTreatmentRepository implements ITreatmentRepository {
  private treatments = new Map<string, Treatment>();

  setTreatments(treatments: Treatment[]): this {
    this.treatments = new Map(treatments.map((treatment) => [treatment.name, treatment]));
    return this;
  }

  async findAll(): Promise<Result<Treatment[]>> {
    return ok([...this.treatments.values()]);
  }

  async saveAll(treatments: Treatment[]): Promise<Result<void>> {
    treatments.forEach((treatment) => this.treatments.set(treatment.name, treatment));
    return ok(undefined);
  }
}
