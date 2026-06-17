import type { HeroProps } from '../../game-glossary/domain/hero';

type HeroBuilderT = {
  withName: (name: string) => HeroBuilderT;
  withIsYoung: (isYoung: boolean) => HeroBuilderT;
  withCounterpart: (counterpart: string | null) => HeroBuilderT;
  build: () => HeroProps;
};

export const heroBuilder = ({
  name = 'Aurora, Emissary of Lightning',
  isYoung = true,
  counterpart = 'Aurora, Legacy of Tempest',
}: Partial<HeroProps> = {}): HeroBuilderT => {
  const props: HeroProps = { name, isYoung, counterpart };

  return {
    withName: (_name: string) => heroBuilder({ ...props, name: _name }),
    withIsYoung: (_isYoung: boolean) => heroBuilder({ ...props, isYoung: _isYoung }),
    withCounterpart: (_counterpart: string | null) =>
      heroBuilder({ ...props, counterpart: _counterpart }),
    build: (): HeroProps => ({ ...props }),
  };
};
