import { BrowserRouter, Route, Routes } from 'react-router';

import { CardDetailsPage } from '@/features/cards/pages/CardDetailsPage/CardDetailsPage.tsx';
import { CardListingPage } from '@/features/cards/pages/CardListingPage/CardListingPage.tsx';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CardListingPage />} />
      <Route path="/cards/:cardIdentifier" element={<CardDetailsPage />} />
    </Routes>
  </BrowserRouter>
);
