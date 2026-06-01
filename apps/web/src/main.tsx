import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from '@/App';
import { createStore } from '@/store';
import { CardApiGateway } from '@/gateways/card.api.gateway';
import { FuseSearchGateway } from '@/gateways/search.fuse.gateway';
import './index.css';

const store = createStore({
  cardGateway: new CardApiGateway(),
  searchGateway: new FuseSearchGateway(),
  collectionService: {},
  authService: {},
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
