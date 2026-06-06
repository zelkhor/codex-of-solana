import { BrowserRouter, Routes, Route } from 'react-router';
import { CardListingView } from '@/features/cards/pages/CardListingView.tsx';
import { CardDetailView } from '@/features/cards/use-cases/view-card-details/CardDetailView.tsx';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CardListingView />} />
      <Route path="/cards/:cardIdentifier" element={<CardDetailView />} />
    </Routes>
  </BrowserRouter>
);
