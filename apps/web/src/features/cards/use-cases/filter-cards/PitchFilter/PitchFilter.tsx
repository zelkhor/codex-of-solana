import { NumericFilterInput } from '@/shared/ui/NumericFilterInput.tsx';

import { usePitchFilterViewModel } from './pitch-filter.view-model.ts';

export const PitchFilter = () => {
  const vm = usePitchFilterViewModel();

  return <NumericFilterInput value={vm.pitch} onChange={vm.setPitchFilter} />;
};
