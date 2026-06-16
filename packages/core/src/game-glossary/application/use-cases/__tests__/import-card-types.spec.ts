import { EmptyTypeNameError } from '../../../domain/type';
import {
  type ImportCardTypesFixtureT,
  createImportCardTypesFixture,
} from './import-card-types.fixture';

describe('Feature: Importing card types', () => {
  let fixture: ImportCardTypesFixtureT;

  beforeEach(() => {
    fixture = createImportCardTypesFixture();
  });

  test('Rule: It rejects a card type whose name is empty', async () => {
    await fixture.whenImportingCardTypes(['']);

    fixture.thenErrorShouldBe(EmptyTypeNameError);
  });

  test("Rule: It adds a card type that doesn't exist yet", async () => {
    await fixture.whenImportingCardTypes(['Weapon']);

    await fixture.thenCardTypesShouldBe(['Weapon']);
  });
});
