import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from '@/App';
import { createStore } from '@/store';
import { loadFilters, saveFilters } from '@/store/filters/filters.persistence';
import { CardApiGateway } from '@/gateways/card.api.gateway';
import { FuseSearchGateway } from '@/gateways/search.fuse.gateway';
import { HttpClient } from '@/gateways/http-client';
import './index.css';

const http = new HttpClient(import.meta.env.VITE_API_URL ?? '');

const store = createStore(
  {
    cardGateway: new CardApiGateway(http),
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
