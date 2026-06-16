import { setReleaseBuilder } from '../../../../__tests__';
import { EmptyGroupNameError } from '../../../domain/set-group';
import { EmptySetNameError } from '../../../domain/set-release';
import {
  type ImportSetReleasesFixtureT,
  createImportSetReleasesFixture,
} from './import-set-releases.fixture';

describe('Feature: Importing set releases', () => {
  let fixture: ImportSetReleasesFixtureT;

  beforeEach(() => {
    fixture = createImportSetReleasesFixture();
  });

  test('Rule: It rejects a set whose name is empty', async () => {
    await fixture.whenImportingSets([setReleaseBuilder().withName('').build()]);

    fixture.thenErrorShouldBe(EmptySetNameError);
  });

  test('Rule: It rejects a set whose group is empty', async () => {
    await fixture.whenImportingSets([setReleaseBuilder().withGroup('').build()]);

    fixture.thenErrorShouldBe(EmptyGroupNameError);
  });

  test('Rule: It adds a set with its group, release date and order', async () => {
    const rosetta = setReleaseBuilder()
      .withName('Rosetta')
      .withGroup('Main Sets')
      .withReleaseDate(new Date('2024-08-09'))
      .withReleaseOrder(0)
      .build();

    await fixture.whenImportingSets([rosetta]);

    await fixture.thenSetsShouldBe([rosetta]);
  });
});
