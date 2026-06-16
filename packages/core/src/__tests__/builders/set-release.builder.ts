import type { SetReleaseProps } from '../../game-glossary/domain/set-release';

type SetReleaseBuilderT = {
  withName: (name: string) => SetReleaseBuilderT;
  withGroup: (group: string) => SetReleaseBuilderT;
  withReleaseDate: (releaseDate: Date) => SetReleaseBuilderT;
  withReleaseOrder: (releaseOrder: number) => SetReleaseBuilderT;
  build: () => SetReleaseProps;
};

export const setReleaseBuilder = ({
  name = 'Rosetta',
  group = 'Main Sets',
  releaseDate = new Date('2024-08-09'),
  releaseOrder = 0,
}: Partial<SetReleaseProps> = {}): SetReleaseBuilderT => {
  const props: SetReleaseProps = { name, group, releaseDate, releaseOrder };

  return {
    withName: (_name: string) => setReleaseBuilder({ ...props, name: _name }),
    withGroup: (_group: string) => setReleaseBuilder({ ...props, group: _group }),
    withReleaseDate: (_releaseDate: Date) =>
      setReleaseBuilder({ ...props, releaseDate: _releaseDate }),
    withReleaseOrder: (_releaseOrder: number) =>
      setReleaseBuilder({ ...props, releaseOrder: _releaseOrder }),
    build: (): SetReleaseProps => ({ ...props }),
  };
};
