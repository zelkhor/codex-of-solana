interface MultiSelectProps {
  options: readonly string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export const MultiSelect = ({ options, selected, onChange }: MultiSelectProps) => (
  <div className="flex flex-wrap gap-1">
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => {
          const next = selected.includes(opt)
            ? selected.filter((v) => v !== opt)
            : [...selected, opt];
          onChange(next);
        }}
        className={`cursor-pointer text-xs px-2 py-0.5 rounded ${
          selected.includes(opt)
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);
