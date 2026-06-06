import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import { cardBuilder, ok } from '@codex/core';

import { HttpClient } from '@/shared/gateways/http-client.ts';

import { CardCatalogApiGateway } from '@/domain/card-catalog/infrastructure/card-catalog.api.gateway.ts';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const gateway = new CardCatalogApiGateway(new HttpClient('http://localhost'));

describe('Integration: CardCatalogApiGateway', () => {
  test('Rule: Returns cards when the server responds successfully', async () => {
    const card = cardBuilder().withCardIdentifier('ninja-strike-red').build();
    server.use(http.get('http://localhost/api/cards', () => HttpResponse.json([card])));

    const result = await gateway.getCards();

    expect(result).toEqual(ok([card]));
  });

  test('Rule: Returns an error when the server responds with a non-ok status', async () => {
    server.use(
      http.get('http://localhost/api/cards', () => new HttpResponse(null, { status: 500 })),
    );

    const result = await gateway.getCards();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Request failed with status 500');
  });

  test('Rule: Returns an error when the network request fails', async () => {
    server.use(http.get('http://localhost/api/cards', () => HttpResponse.error()));

    const result = await gateway.getCards();

    expect(result.ok).toBe(false);
  });
});
