import { defineArtistFactory } from '../../generated/fabbrica';

export const ArtistFactory = defineArtistFactory({
  defaultData: ({ seq }) => ({ name: `Artist ${seq}` }),
});
