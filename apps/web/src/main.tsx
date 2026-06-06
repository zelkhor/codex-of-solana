import { App } from '@/App';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { HttpClient } from '@/shared/gateways/http-client';
import { createStore } from '@/shared/store';

import { CardCatalogApiGateway } from '@/domain/card-catalog/infrastructure/card-catalog.api.gateway.ts';
import { FuseSearchGateway } from '@/domain/card-catalog/infrastructure/search.fuse.gateway.ts';
import { loadFilters, saveFilters } from '@/domain/filter/infrastructure/filters.storage.ts';

import './index.css';

const http = new HttpClient(import.meta.env.VITE_API_URL ?? '');

const store = createStore(
  {
    cardCatalogGateway: new CardCatalogApiGateway(http),
    searchGateway: new FuseSearchGateway(),
    collectionGateway: {},
    authGateway: {},
  },
  { filters: loadFilters() },
);

store.subscribe(() => saveFilters(store.getState().filters));

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
