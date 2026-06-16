import { EmptyKeywordNameError } from '../../../domain/keyword';
import {
  type ImportKeywordsFixtureT,
  createImportKeywordsFixture,
} from './import-keywords.fixture';

describe('Feature: Importing keywords', () => {
  let fixture: ImportKeywordsFixtureT;

  beforeEach(() => {
    fixture = createImportKeywordsFixture();
  });

  test('Rule: It rejects a keyword whose name is empty', async () => {
    await fixture.whenImportingKeywords(['']);

    fixture.thenErrorShouldBe(EmptyKeywordNameError);
  });

  test("Rule: It adds a keyword that doesn't exist yet", async () => {
    await fixture.whenImportingKeywords(['Dominate']);

    await fixture.thenKeywordsShouldBe(['Dominate']);
  });
});
