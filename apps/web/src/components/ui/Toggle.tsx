import { useId } from 'react';
import { Switch } from '@/components/ui/Switch.tsx';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const Toggle = ({ checked, onChange, label }: ToggleProps) => {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3">
      <label
        htmlFor={id}
        className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer select-none"
      >
        {label}
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
};
