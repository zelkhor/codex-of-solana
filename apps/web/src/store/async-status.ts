export const ASYNC_STATUS = {
  Idle: 'idle',
  Loading: 'loading',
  Succeeded: 'succeeded',
  Failed: 'failed',
} as const;

export type AsyncStatusT = (typeof ASYNC_STATUS)[keyof typeof ASYNC_STATUS];