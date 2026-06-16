import { EmptyEditionNameError } from '../../../domain/edition';
import {
  type ImportEditionsFixtureT,
  createImportEditionsFixture,
} from './import-editions.fixture';

describe('Feature: Importing editions', () => {
  let fixture: ImportEditionsFixtureT;

  beforeEach(() => {
    fixture = createImportEditionsFixture();
  });

  test('Rule: It rejects an edition whose name is empty', async () => {
    await fixture.whenImportingEditions(['']);

    fixture.thenErrorShouldBe(EmptyEditionNameError);
  });

  test("Rule: It adds an edition that doesn't exist yet", async () => {
    await fixture.whenImportingEditions(['Unlimited']);

    await fixture.thenEditionsShouldBe(['Unlimited']);
  });
});
