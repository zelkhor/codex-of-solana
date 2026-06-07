import { useDispatch, useSelector } from 'react-redux';

import { KEYWORDS, type KeywordT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';
import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import { setKeywordFilterMode, setKeywords } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useKeywordsFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { keywords, keywordFilterMode } = useSelector(selectFilters);

  return {
    options: Object.values(KEYWORDS),
    keywords,
    keywordFilterMode,
    setKeywords: (v: string[]) => dispatch(setKeywords(v as KeywordT[])),
    setKeywordFilterMode: (v: FilterModeT) => dispatch(setKeywordFilterMode(v)),
  };
};
