import { ModeToggle } from '@/shared/ui/ModeToggle.tsx';
import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';

import { FILTER_MODE_OPTIONS } from '../filter-mode-options.ts';
import { useTreatmentFilterViewModel } from './treatment-filter.view-model.ts';

export const TreatmentFilter = () => {
  const vm = useTreatmentFilterViewModel();

  return (
    <div className="space-y-1.5">
      <div className="pt-2">
        <ModeToggle
          options={FILTER_MODE_OPTIONS}
          value={vm.treatmentFilterMode}
          onChange={vm.setTreatmentFilterMode}
        />
      </div>
      <MultiSelect
        options={vm.options}
        selected={vm.treatments}
        onChange={vm.setTreatments}
        placeholder="e.g. Alternate Art, Full Art, ..."
      />
    </div>
  );
};
