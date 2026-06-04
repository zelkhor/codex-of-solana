import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  COMPARISON_OPERATORS,
  type ComparisonOperatorT,
  type NumericFilterT,
} from '@/store/filters/filters.slice';
import { Select } from '@/components/ui/Select';

interface NumericFilterInputProps {
  value: NumericFilterT;
  onChange: (value: NumericFilterT) => void;
}

const OPERATOR_OPTIONS = [
  { value: COMPARISON_OPERATORS.GT, label: '>' },
  { value: COMPARISON_OPERATORS.GTE, label: '≥' },
  { value: COMPARISON_OPERATORS.EQ, label: '=' },
  { value: COMPARISON_OPERATORS.LTE, label: '≤' },
  { value: COMPARISON_OPERATORS.LT, label: '<' },
];

export const NumericFilterInput = ({ value, onChange }: NumericFilterInputProps) => (
  <div className="flex items-center gap-2">
    <Select
      options={OPERATOR_OPTIONS}
      value={value.operator}
      onChange={(v) => onChange({ ...value, operator: v as ComparisonOperatorT })}
      className="w-16"
    />
    <div className="relative">
      <input
        type="number"
        min={0}
        value={value.value ?? ''}
        onChange={(e) =>
          onChange({ ...value, value: e.target.value === '' ? null : Number(e.target.value) })
        }
        placeholder="—"
        className="w-16 text-sm bg-zinc-100 dark:bg-zinc-700 rounded-lg pl-2.5 pr-6 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
        <button
          type="button"
          onClick={() => onChange({ ...value, value: (value.value ?? -1) + 1 })}
          className="cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 leading-none"
        >
          <ChevronUp size={10} />
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              value: value.value !== null && value.value > 0 ? value.value - 1 : null,
            })
          }
          className="cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 leading-none"
        >
          <ChevronDown size={10} />
        </button>
      </div>
    </div>
  </div>
);
