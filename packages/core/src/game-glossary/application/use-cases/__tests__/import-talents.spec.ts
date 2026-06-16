import { EmptyTalentNameError } from '../../../domain/game-glossary.errors';
import { type ImportTalentsFixtureT, createImportTalentsFixture } from './import-talents.fixture';

describe('Feature: Importing game talents', () => {
  let fixture: ImportTalentsFixtureT;

  beforeEach(() => {
    fixture = createImportTalentsFixture();
  });

  test('Rule: It rejects a talent whose name is empty', async () => {
    await fixture.whenImportingTalents(['']);

    fixture.thenErrorShouldBe(EmptyTalentNameError);
  });

  test("Rule: It adds a talent that doesn't exist yet", async () => {
    await fixture.whenImportingTalents(['Lightning']);

    await fixture.thenTalentsShouldBe(['Lightning']);
  });
});
