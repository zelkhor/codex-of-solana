import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  COMPARISON_OPERATORS,
  type ComparisonOperatorT,
  type NumericFilterT,
} from '@/store/filters/filters.slice';

interface NumericFilterInputProps {
  value: NumericFilterT;
  onChange: (value: NumericFilterT) => void;
}

export const NumericFilterInput = ({ value, onChange }: NumericFilterInputProps) => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <select
        value={value.operator}
        onChange={(e) => onChange({ ...value, operator: e.target.value as ComparisonOperatorT })}
        className="cursor-pointer appearance-none text-sm bg-zinc-100 dark:bg-zinc-700 rounded-md pl-2.5 pr-6 py-1 text-zinc-700 dark:text-zinc-300 outline-none"
      >
        <option value={COMPARISON_OPERATORS.GT}>&gt;</option>
        <option value={COMPARISON_OPERATORS.GTE}>&ge;</option>
        <option value={COMPARISON_OPERATORS.EQ}>=</option>
        <option value={COMPARISON_OPERATORS.LTE}>&le;</option>
        <option value={COMPARISON_OPERATORS.LT}>&lt;</option>
      </select>
      <ChevronDown
        size={11}
        className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400"
      />
    </div>
    <div className="relative">
      <input
        type="number"
        min={0}
        value={value.value ?? ''}
        onChange={(e) =>
          onChange({ ...value, value: e.target.value === '' ? null : Number(e.target.value) })
        }
        placeholder="—"
        className="w-16 text-sm bg-zinc-100 dark:bg-zinc-700 rounded-md pl-2.5 pr-6 py-1 text-zinc-700 dark:text-zinc-300 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
