import { type Result, err } from '../../../shared/helpers/result';
import type { TransactionPerformer } from '../../../shared/helpers/transaction';
import {
  Hero,
  HeroAlreadyHasAdultFormError,
  HeroAlreadyHasYoungFormError,
  HeroNotFoundError,
  NotAYoungHeroError,
  NotAnAdultHeroError,
} from '../../domain/hero';
import type { IHeroRepository } from '../hero.repository';

export type HeroInput = {
  name: string;
  isYoung: boolean;
  counterpart: string | null;
};

export type ImportHeroesCommand = {
  heroes: HeroInput[];
};

type LinkState = { isYoung: boolean; counterpart: string | null };

export class ImportHeroesUseCase<Client> {
  constructor(
    private readonly repository: IHeroRepository<Client>,
    private readonly transactionPerformer: TransactionPerformer<Client>,
  ) {}

  async execute({ heroes }: ImportHeroesCommand): Promise<Result<void>> {
    const existing = await this.repository.findAll();
    if (!existing.ok) return existing;

    const state = new Map<string, LinkState>();
    for (const hero of existing.value) {
      state.set(hero.name, { isYoung: hero.isYoung, counterpart: hero.counterpart });
    }

    const toSave: Hero[] = [];
    for (const input of heroes) {
      const created = Hero.create(input);
      if (!created.ok) return err(created.error);
      if (!state.has(input.name)) {
        state.set(input.name, { isYoung: input.isYoung, counterpart: null });
        toSave.push(created.value);
      }
    }

    const pairings = new Map<string, { youngName: string; adultName: string }>();
    for (const input of heroes) {
      if (input.counterpart === null) continue;
      const youngName = input.isYoung ? input.name : input.counterpart;
      const adultName = input.isYoung ? input.counterpart : input.name;
      pairings.set(JSON.stringify([youngName, adultName]), { youngName, adultName });
    }

    for (const { youngName, adultName } of pairings.values()) {
      const young = state.get(youngName);
      if (!young) return err(new HeroNotFoundError(youngName));
      const adult = state.get(adultName);
      if (!adult) return err(new HeroNotFoundError(adultName));
      if (!young.isYoung) return err(new NotAYoungHeroError(youngName));
      if (adult.isYoung) return err(new NotAnAdultHeroError(adultName));
      if (young.counterpart !== null && young.counterpart !== adultName)
        return err(new HeroAlreadyHasAdultFormError(youngName));
      if (adult.counterpart !== null && adult.counterpart !== youngName)
        return err(new HeroAlreadyHasYoungFormError(adultName));

      state.set(youngName, { isYoung: young.isYoung, counterpart: adultName });
      state.set(adultName, { isYoung: adult.isYoung, counterpart: youngName });
    }

    return this.transactionPerformer.perform((tx) => this.repository.saveAll(toSave)(tx));
  }
}
