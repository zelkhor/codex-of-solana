export const SORT_ORDER = {
  SET_ASC: 'set-asc',
  SET_DESC: 'set-desc',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
};
export type SortOrderT = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];
