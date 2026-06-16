import { EmptyGroupNameError, GroupAlreadyExistsError } from '../../../domain/set-group';
import {
  type CreateSetGroupFixtureT,
  createCreateSetGroupFixture,
} from './create-set-group.fixture';

describe('Feature: Creating a set group', () => {
  let fixture: CreateSetGroupFixtureT;

  beforeEach(() => {
    fixture = createCreateSetGroupFixture();
  });

  test('Rule: It rejects a group whose name is blank', async () => {
    await fixture.whenCreatingGroup('   ');

    fixture.thenErrorShouldBe(EmptyGroupNameError);
  });

  test('Rule: It creates a group that does not exist yet', async () => {
    await fixture.whenCreatingGroup('Main Sets');

    await fixture.thenGroupsShouldBe(['Main Sets']);
  });

  test('Rule: It trims surrounding whitespace from the name', async () => {
    await fixture.whenCreatingGroup('  Blitz Decks  ');

    await fixture.thenGroupsShouldBe(['Blitz Decks']);
  });

  test('Rule: It rejects a group that already exists, ignoring case', async () => {
    await fixture.givenExistingGroups(['Main Sets']);

    await fixture.whenCreatingGroup('main sets');

    fixture.thenErrorShouldBe(GroupAlreadyExistsError);
  });
});
