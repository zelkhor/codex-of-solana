import { FILTER_MODES, type FilterModeT } from '@/shared/types/filter-mode.ts';

export const FILTER_MODE_OPTIONS: { value: FilterModeT; label: string }[] = [
  { value: FILTER_MODES.ANY, label: 'Any' },
  { value: FILTER_MODES.EXACT, label: 'Exact' },
];
