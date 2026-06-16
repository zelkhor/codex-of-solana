import { EmptyFormatNameError } from '../../../domain/format';
import { type ImportFormatsFixtureT, createImportFormatsFixture } from './import-formats.fixture';

describe('Feature: Importing formats', () => {
  let fixture: ImportFormatsFixtureT;

  beforeEach(() => {
    fixture = createImportFormatsFixture();
  });

  test('Rule: It rejects a format whose name is empty', async () => {
    await fixture.whenImportingFormats(['']);

    fixture.thenErrorShouldBe(EmptyFormatNameError);
  });

  test("Rule: It adds a format that doesn't exist yet", async () => {
    await fixture.whenImportingFormats(['Blitz']);

    await fixture.thenFormatsShouldBe(['Blitz']);
  });
});
