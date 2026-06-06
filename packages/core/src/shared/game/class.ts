import { Class } from '@flesh-and-blood/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { NotClassed: _notClassed, ...CLASSES_MAP } = Class;
export const CLASSES = CLASSES_MAP;
export type ClassT = (typeof CLASSES)[keyof typeof CLASSES];
