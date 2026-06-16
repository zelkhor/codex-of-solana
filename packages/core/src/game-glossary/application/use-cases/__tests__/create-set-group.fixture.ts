import { createFixture } from '../../../../__tests__/helpers/create-fixture';
import { SetGroup } from '../../../domain/set-group';
import { InMemorySetGroupRepository } from '../../../infrastructure/set-group.inmemory.repository';
import { CreateSetGroupUseCase } from '../create-set-group.usecase';

export const createCreateSetGroupFixture = () => {
  const fixture = createFixture();
  const repository = new InMemorySetGroupRepository();
  const useCase = new CreateSetGroupUseCase(repository);

  return {
    ...fixture,
    async givenExistingGroups(names: string[]) {
      for (const name of names) {
        const group = SetGroup.create(name);
        if (group.ok) await repository.save(group.value);
      }
    },
    async whenCreatingGroup(name: string) {
      const result = await useCase.execute({ name });
      if (!result.ok) fixture.captureError(result.error);
    },
    async thenGroupsShouldBe(expectedNames: string[]) {
      const result = await repository.findAll();
      if (!result.ok)
        throw new Error('thenGroupsShouldBe: expected a successful read but got an error');
      expect(result.value.map((group) => group.name)).toEqual(expectedNames);
    },
  };
};

export type CreateSetGroupFixtureT = ReturnType<typeof createCreateSetGroupFixture>;
