import type { StateBuilderProvider } from './state.builder';

export const createFixture = <T>(
  builder: (stateBuilder: StateBuilderProvider) => T,
): ((stateBuilder: StateBuilderProvider) => T) => {
  return (stateBuilder: StateBuilderProvider) => builder(stateBuilder);
};