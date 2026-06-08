import { EmptyClassNameError } from '../../domain/game-glossary.errors';
import { type ImportClassesFixtureT, createImportClassesFixture } from './import-classes.fixture';

describe('Feature: Importing game classes', () => {
  let fixture: ImportClassesFixtureT;

  beforeEach(() => {
    fixture = createImportClassesFixture();
  });

  test('Rule: It rejects a class whose name is empty', async () => {
    await fixture.whenImportingClasses(['']);

    fixture.thenErrorShouldBe(EmptyClassNameError);
  });

  test("Rule: It adds a class that doesn't exist yet", async () => {
    await fixture.whenImportingClasses(['Warrior']);

    await fixture.thenClassesShouldBe(['Warrior']);
  });

  test('Rule: It does not add a class that already exists', async () => {
    fixture.givenPreExistingClasses(['Warrior']);

    await fixture.whenImportingClasses(['Warrior', 'Brute']);

    await fixture.thenClassesShouldBe(['Warrior', 'Brute']);
  });
});
