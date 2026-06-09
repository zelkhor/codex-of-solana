import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '@/domain/store';
import type { RootState } from '@/domain/store/root-reducer.ts';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
