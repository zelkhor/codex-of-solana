import { type FiltersState, initialFiltersState } from './filters.slice';

export const FILTERS_STORAGE_KEY = 'codex:filters';

export const loadFilters = (): FiltersState | undefined => {
  try {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (raw === null) return undefined;
    return { ...initialFiltersState, ...(JSON.parse(raw) as Partial<FiltersState>) };
  } catch {
    localStorage.removeItem(FILTERS_STORAGE_KEY);
    return undefined;
  }
};

export const saveFilters = (state: FiltersState): void => {
  try {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or storage unavailable — silently ignore
    localStorage.removeItem(FILTERS_STORAGE_KEY);
  }
};
