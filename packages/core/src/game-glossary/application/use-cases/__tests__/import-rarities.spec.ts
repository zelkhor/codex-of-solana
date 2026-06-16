import { EmptyRarityNameError } from '../../../domain/game-glossary.errors';
import {
  type ImportRaritiesFixtureT,
  createImportRaritiesFixture,
} from './import-rarities.fixture';

describe('Feature: Importing rarities', () => {
  let fixture: ImportRaritiesFixtureT;

  beforeEach(() => {
    fixture = createImportRaritiesFixture();
  });

  test('Rule: It rejects a rarity whose name is empty', async () => {
    await fixture.whenImportingRarities(['']);

    fixture.thenErrorShouldBe(EmptyRarityNameError);
  });

  test("Rule: It adds a rarity that doesn't exist yet", async () => {
    await fixture.whenImportingRarities(['Majestic']);

    await fixture.thenRaritiesShouldBe(['Majestic']);
  });
});
