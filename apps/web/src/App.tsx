import { BrowserRouter, Routes, Route } from 'react-router';
import { CardListingView } from '@/views/CardListingView';
import { CardDetailView } from '@/views/CardDetailView';
import { CollectionView } from '@/views/CollectionView';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CardListingView />} />
      <Route path="/cards/:cardIdentifier" element={<CardDetailView />} />
      <Route path="/collection" element={<CollectionView />} />
    </Routes>
  </BrowserRouter>
);
