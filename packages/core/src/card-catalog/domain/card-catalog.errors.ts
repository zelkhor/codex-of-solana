import { AppError } from '../../shared/helpers/errors';

export class CardCatalogLoadError extends AppError {
  constructor(cause?: string) {
    super(
      'CARD_CATALOG_LOAD_ERROR',
      cause ? `Failed to load card catalog: ${cause}` : 'Failed to load card catalog',
    );
  }
}
