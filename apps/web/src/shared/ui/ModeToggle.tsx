interface ModeToggleProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export const ModeToggle = <T extends string>({ options, value, onChange }: ModeToggleProps<T>) => (
  <div className="inline-flex border border-zinc-300 dark:border-zinc-600 rounded overflow-hidden divide-x divide-zinc-300 dark:divide-zinc-600">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`cursor-pointer px-2 py-0.5 text-xs font-medium transition-colors ${
          value === opt.value
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);
