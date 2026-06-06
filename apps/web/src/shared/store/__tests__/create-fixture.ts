import { type StateBuilderProvider } from '@/shared/store/__tests__/state.builder.ts';

export const createFixture = <T>(
  builder: (stateBuilder: StateBuilderProvider) => T,
): ((stateBuilder: StateBuilderProvider) => T) => {
  return (stateBuilder: StateBuilderProvider) => builder(stateBuilder);
};
