import { EmptyFoilingNameError, UnknownFoilingError } from '../../../domain/foiling';
import {
  type ImportFoilingsFixtureT,
  createImportFoilingsFixture,
} from './import-foilings.fixture';

describe('Feature: Importing foilings', () => {
  let fixture: ImportFoilingsFixtureT;

  beforeEach(() => {
    fixture = createImportFoilingsFixture();
  });

  test('Rule: It rejects a foiling whose name is empty', async () => {
    await fixture.whenImportingFoilings(['']);

    fixture.thenErrorShouldBe(EmptyFoilingNameError);
  });

  test('Rule: It rejects a foiling that has no known game order', async () => {
    await fixture.whenImportingFoilings(['Holographic']);

    fixture.thenErrorShouldBe(UnknownFoilingError);
  });

  test('Rule: It ranks foilings as regular < rainbow < cold < gold', async () => {
    await fixture.whenImportingFoilings(['Gold', 'Regular', 'Cold', 'Rainbow']);

    await fixture.thenFoilingsShouldBe([
      { name: 'Gold', order: 3 },
      { name: 'Regular', order: 0 },
      { name: 'Cold', order: 2 },
      { name: 'Rainbow', order: 1 },
    ]);
  });
});
