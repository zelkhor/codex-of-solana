import { EmptyClassNameError } from '../../../domain/game-glossary.errors';
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
});
