import { heroBuilder } from '../../../../__tests__';
import {
  EmptyHeroNameError,
  HeroAlreadyHasAdultFormError,
  HeroAlreadyHasYoungFormError,
  NotAYoungHeroError,
  NotAnAdultHeroError,
} from '../../../domain/hero';
import { type ImportHeroesFixtureT, createImportHeroesFixture } from './import-heroes.fixture';

describe('Feature: Importing heroes', () => {
  let fixture: ImportHeroesFixtureT;

  beforeEach(() => {
    fixture = createImportHeroesFixture();
  });

  test('Rule: It rejects a hero whose name is empty', async () => {
    await fixture.whenImportingHeroes([heroBuilder().withName('').withCounterpart(null).build()]);

    fixture.thenErrorShouldBe(EmptyHeroNameError);
  });

  test('Rule: It adds a hero with no counterpart', async () => {
    const hero = heroBuilder()
      .withName('Lone Young')
      .withIsYoung(true)
      .withCounterpart(null)
      .build();

    await fixture.whenImportingHeroes([hero]);

    await fixture.thenHeroesShouldBe([hero]);
  });

  test('Rule: It links a young and an adult imported together as counterparts', async () => {
    const young = heroBuilder()
      .withName('Young Hero')
      .withIsYoung(true)
      .withCounterpart('Adult Hero')
      .build();
    const adult = heroBuilder()
      .withName('Adult Hero')
      .withIsYoung(false)
      .withCounterpart('Young Hero')
      .build();

    await fixture.whenImportingHeroes([young, adult]);

    await fixture.thenCounterpartOfShouldBe('Young Hero', 'Adult Hero');
    await fixture.thenCounterpartOfShouldBe('Adult Hero', 'Young Hero');
  });

  test('Rule: It links a newly imported adult to an already-existing young', async () => {
    fixture.givenExistingHeroes([
      heroBuilder().withName('Young Hero').withIsYoung(true).withCounterpart(null).build(),
    ]);

    await fixture.whenImportingHeroes([
      heroBuilder().withName('Adult Hero').withIsYoung(false).withCounterpart('Young Hero').build(),
    ]);

    await fixture.thenCounterpartOfShouldBe('Young Hero', 'Adult Hero');
    await fixture.thenCounterpartOfShouldBe('Adult Hero', 'Young Hero');
  });

  test('Rule: It rejects pairing a young hero with another young hero', async () => {
    await fixture.whenImportingHeroes([
      heroBuilder().withName('Young Hero').withIsYoung(true).withCounterpart('Other Young').build(),
      heroBuilder().withName('Other Young').withIsYoung(true).withCounterpart(null).build(),
    ]);

    fixture.thenErrorShouldBe(NotAnAdultHeroError);
  });

  test('Rule: It rejects pairing an adult hero with another adult hero', async () => {
    await fixture.whenImportingHeroes([
      heroBuilder()
        .withName('Adult Hero')
        .withIsYoung(false)
        .withCounterpart('Other Adult')
        .build(),
      heroBuilder().withName('Other Adult').withIsYoung(false).withCounterpart(null).build(),
    ]);

    fixture.thenErrorShouldBe(NotAYoungHeroError);
  });

  test('Rule: It rejects linking a young hero that already has an adult form', async () => {
    fixture.givenExistingHeroes([
      heroBuilder().withName('Young Hero').withIsYoung(true).withCounterpart('Adult Hero').build(),
      heroBuilder().withName('Adult Hero').withIsYoung(false).withCounterpart('Young Hero').build(),
    ]);

    await fixture.whenImportingHeroes([
      heroBuilder()
        .withName('Other Adult')
        .withIsYoung(false)
        .withCounterpart('Young Hero')
        .build(),
    ]);

    fixture.thenErrorShouldBe(HeroAlreadyHasAdultFormError);
  });

  test('Rule: It rejects linking an adult hero that already has a young form', async () => {
    fixture.givenExistingHeroes([
      heroBuilder().withName('Young Hero').withIsYoung(true).withCounterpart('Adult Hero').build(),
      heroBuilder().withName('Adult Hero').withIsYoung(false).withCounterpart('Young Hero').build(),
    ]);

    await fixture.whenImportingHeroes([
      heroBuilder().withName('Other Young').withIsYoung(true).withCounterpart('Adult Hero').build(),
    ]);

    fixture.thenErrorShouldBe(HeroAlreadyHasYoungFormError);
  });
});
