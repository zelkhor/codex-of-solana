export const PITCH_VALUES = { Red: 1, Yellow: 2, Blue: 3 } as const;
export type PitchT = (typeof PITCH_VALUES)[keyof typeof PITCH_VALUES];
