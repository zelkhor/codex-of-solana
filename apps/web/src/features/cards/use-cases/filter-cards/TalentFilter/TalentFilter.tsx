import { ModeToggle } from '@/shared/ui/ModeToggle.tsx';
import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';

import { FILTER_MODE_OPTIONS } from '../filter-mode-options.ts';
import { useTalentFilterViewModel } from './talent-filter.view-model.ts';

export const TalentFilter = () => {
  const vm = useTalentFilterViewModel();

  return (
    <div className="space-y-1.5">
      <div className="pt-2">
        <ModeToggle
          options={FILTER_MODE_OPTIONS}
          value={vm.talentFilterMode}
          onChange={vm.setTalentFilterMode}
        />
      </div>
      <MultiSelect
        options={vm.options}
        selected={vm.talents}
        onChange={vm.setTalents}
        placeholder="e.g. Earth, Draconic, Mystic, ..."
      />
    </div>
  );
};
