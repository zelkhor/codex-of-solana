import { EmptyTreatmentNameError } from '../../../domain/treatment';
import {
  type ImportTreatmentsFixtureT,
  createImportTreatmentsFixture,
} from './import-treatments.fixture';

describe('Feature: Importing treatments', () => {
  let fixture: ImportTreatmentsFixtureT;

  beforeEach(() => {
    fixture = createImportTreatmentsFixture();
  });

  test('Rule: It rejects a treatment whose name is empty', async () => {
    await fixture.whenImportingTreatments(['']);

    fixture.thenErrorShouldBe(EmptyTreatmentNameError);
  });

  test("Rule: It adds a treatment that doesn't exist yet", async () => {
    await fixture.whenImportingTreatments(['Full Art']);

    await fixture.thenTreatmentsShouldBe(['Full Art']);
  });
});
