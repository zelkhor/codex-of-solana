import { type Result, ok } from '../../shared/helpers/result';
import type { IClassRepository } from '../application/class.repository';
import type { Class } from '../domain/class';

export class InMemoryClassRepository implements IClassRepository {
  private classes = new Map<string, Class>();

  setClasses(classes: Class[]): this {
    this.classes = new Map(classes.map((aClass) => [aClass.name, aClass]));
    return this;
  }

  async findAll(): Promise<Result<Class[]>> {
    return ok([...this.classes.values()]);
  }

  async saveAll(classes: Class[]): Promise<Result<void>> {
    classes.forEach((aClass) => this.classes.set(aClass.name, aClass));
    return ok(undefined);
  }
}
