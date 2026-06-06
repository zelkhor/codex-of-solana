export const ASYNC_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;

export type AsyncStatusT = (typeof ASYNC_STATUS)[keyof typeof ASYNC_STATUS];
