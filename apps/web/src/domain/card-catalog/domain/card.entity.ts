import { createEntityAdapter } from '@reduxjs/toolkit';

import type { Card } from '@codex/core';

export const cardsAdapter = createEntityAdapter<Card, string>({
  selectId: (card) => card.cardIdentifier,
});
