import { AppHeader } from '@/components/layout/AppHeader';

export const CollectionView = () => (
  <div className="flex flex-col h-screen overflow-hidden">
    <AppHeader />
    <main className="flex-1 flex items-center justify-center">
      <p className="text-muted-foreground">Collection — coming soon</p>
    </main>
  </div>
);
