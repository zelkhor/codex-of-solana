import type { GridSlot } from '@/store/card-catalog/card-catalog.selectors';

export type GridRow = { type: 'card-row'; slots: GridSlot[] };

export const buildCardGridRows = (slots: GridSlot[]): GridRow[] => {
  const rows: GridRow[] = [];
  for (let i = 0; i < slots.length; i += 3) {
    rows.push({ type: 'card-row', slots: slots.slice(i, i + 3) });
  }
  return rows;
};
