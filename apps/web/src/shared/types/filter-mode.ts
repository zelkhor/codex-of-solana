export const FILTER_MODES = {
  ANY: 'any',
  EXACT: 'exact',
} as const;

export type FilterModeT = (typeof FILTER_MODES)[keyof typeof FILTER_MODES];
