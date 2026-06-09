import { beforeEach, describe, expect, test } from 'vitest';

import { SUBTYPES } from '@codex/core';
import { cardBuilder } from '@codex/core/testing';

import { FuseSearchGateway } from '@/domain/card-catalog/infrastructure/search.fuse.gateway.ts';

describe('Feature: Searching the card catalog', () => {
  let gateway: FuseSearchGateway;

  beforeEach(() => {
    gateway = new FuseSearchGateway();
  });

  test('Rule: Returns nothing before the catalog is indexed', () => {
    expect(gateway.search('Ninja Strike')).toHaveLength(0);
  });

  test('Rule: Queries shorter than 2 characters return nothing', () => {
    gateway.index([cardBuilder().withName('Ninja Strike').build()]);

    expect(gateway.search('n')).toHaveLength(0);
  });

  test('Rule: An exact name match finds the card', () => {
    const card = cardBuilder().withName('Ninja Strike').build();
    gateway.index([card]);

    const results = gateway.search('Ninja Strike');

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Ninja Strike');
  });

  test('Rule: A slightly misspelled name still finds the right card', () => {
    const card = cardBuilder().withName('Ninja Strike').build();
    gateway.index([card]);

    expect(gateway.search('Nnja Strike')).toHaveLength(1);
  });

  test('Rule: A name match ranks above a type match for the same query', () => {
    const matchedByNameAndSubtype = cardBuilder()
      .withCardIdentifier('endless-arrow-red')
      .withName('Endless arrow')
      .withSubtypes([SUBTYPES.Arrow])
      .build();
    const matchedBySubtypeOnly = cardBuilder()
      .withCardIdentifier('red-in-the-ledger-red')
      .withName('Red in the ledger')
      .withSubtypes([SUBTYPES.Arrow])
      .build();

    gateway.index([matchedByNameAndSubtype, matchedBySubtypeOnly]);

    const results = gateway.search('Arrow');

    expect(results[0].name).toBe('Endless arrow');
    expect(results[1].name).toBe('Red in the ledger');
  });
});
