import { EmptySubtypeNameError } from '../../../domain/subtype';
import {
  type ImportSubtypesFixtureT,
  createImportSubtypesFixture,
} from './import-subtypes.fixture';

describe('Feature: Importing card subtypes', () => {
  let fixture: ImportSubtypesFixtureT;

  beforeEach(() => {
    fixture = createImportSubtypesFixture();
  });

  test('Rule: It rejects a subtype whose name is empty', async () => {
    await fixture.whenImportingSubtypes(['']);

    fixture.thenErrorShouldBe(EmptySubtypeNameError);
  });

  test("Rule: It adds a subtype that doesn't exist yet", async () => {
    await fixture.whenImportingSubtypes(['Sword']);

    await fixture.thenSubtypesShouldBe(['Sword']);
  });
});
