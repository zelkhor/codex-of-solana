import { type StateBuilderProvider } from '@/domain/store/__tests__/state.builder.ts';

export const createFixture = <T>(
  builder: (stateBuilder: StateBuilderProvider) => T,
): ((stateBuilder: StateBuilderProvider) => T) => {
  return (stateBuilder: StateBuilderProvider) => builder(stateBuilder);
};
