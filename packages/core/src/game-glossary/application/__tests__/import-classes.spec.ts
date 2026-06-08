import { EmptyClassNameError } from '../../domain/game-glossary.errors';
import { createImportClassesFixture } from './import-classes.fixture';

describe('Feature: Importing game classes', () => {
  test('Rule: It rejects a class whose name is empty', async () => {
    const fixture = createImportClassesFixture();

    await fixture.whenImportingClasses(['']);

    fixture.thenErrorShouldBe(EmptyClassNameError);
  });
});
