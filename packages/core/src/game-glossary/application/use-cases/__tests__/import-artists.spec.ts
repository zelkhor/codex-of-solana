import { EmptyArtistNameError } from '../../../domain/artist';
import { type ImportArtistsFixtureT, createImportArtistsFixture } from './import-artists.fixture';

describe('Feature: Importing artists', () => {
  let fixture: ImportArtistsFixtureT;

  beforeEach(() => {
    fixture = createImportArtistsFixture();
  });

  test('Rule: It rejects an artist whose name is empty', async () => {
    await fixture.whenImportingArtists(['']);

    fixture.thenErrorShouldBe(EmptyArtistNameError);
  });

  test("Rule: It adds an artist that doesn't exist yet", async () => {
    await fixture.whenImportingArtists(['Tomasz Jedruszek']);

    await fixture.thenArtistsShouldBe(['Tomasz Jedruszek']);
  });
});
