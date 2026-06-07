import { ModeToggle } from '@/shared/ui/ModeToggle.tsx';
import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';

import { FILTER_MODE_OPTIONS } from '../filter-mode-options.ts';
import { useKeywordsFilterViewModel } from './keyword-filter.view-model.ts';

export const KeywordFilter = () => {
  const vm = useKeywordsFilterViewModel();

  return (
    <div className="space-y-1.5">
      <div className="pt-2">
        <ModeToggle
          options={FILTER_MODE_OPTIONS}
          value={vm.keywordFilterMode}
          onChange={vm.setKeywordFilterMode}
        />
      </div>
      <MultiSelect
        options={vm.options}
        selected={vm.keywords}
        onChange={vm.setKeywords}
        placeholder="e.g. Dominate, Go again, ..."
      />
    </div>
  );
};
