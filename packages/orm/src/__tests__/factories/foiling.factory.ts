import { defineFoilingFactory } from '../../generated/fabbrica';

export const FoilingFactory = defineFoilingFactory({
  defaultData: ({ seq }) => ({ name: `Foiling ${seq}` }),
});
