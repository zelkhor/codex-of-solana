export const COMPARISON_OPERATORS = {
  GT: '>',
  GTE: '>=',
  EQ: '=',
  LTE: '<=',
  LT: '<',
};
export type ComparisonOperatorT = (typeof COMPARISON_OPERATORS)[keyof typeof COMPARISON_OPERATORS];

export type NumericComparisonT = {
  operator: ComparisonOperatorT;
  value: number | null;
};
