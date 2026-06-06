import { type ReactNode, useState } from 'react';

import { ChevronDown } from 'lucide-react';

interface AccordionSectionProps {
  label: string;
  badge?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const AccordionSection = ({
  label,
  badge,
  defaultOpen = false,
  children,
}: AccordionSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer flex items-center justify-between w-full py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </span>
          {!open && !!badge && (
            <span className="text-xs bg-zinc-800 text-white dark:bg-gray-200 dark:text-zinc-900 rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-zinc-400 transition-transform duration-200${open ? ' rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-2 sm:mt-1.5">{children}</div>}
    </div>
  );
};
