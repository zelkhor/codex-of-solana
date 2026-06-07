import { FORMATS, type FormatT } from '@codex/core';

import { SingleSelect } from '@/shared/ui/SingleSelect.tsx';

const FORMAT_OPTIONS = Object.values(FORMATS) as FormatT[];

interface FormatFilterProps {
  value: FormatT | null;
  onChange: (format: FormatT | null) => void;
}

export const FormatFilter = ({ value, onChange }: FormatFilterProps) => (
  <SingleSelect
    options={FORMAT_OPTIONS}
    value={value}
    onChange={onChange}
    placeholder="Any format"
    clearLabel="Any format"
  />
);
