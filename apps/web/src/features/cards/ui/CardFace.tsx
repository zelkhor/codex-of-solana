import { useState } from 'react';

import { CardBack } from '@/features/cards/ui/CardBack.tsx';
import { TiltCard } from '@/features/cards/ui/TiltCard.tsx';
import { type TiltEffect } from '@/features/cards/ui/card.helpers.ts';

interface CardFaceProps {
  src: string;
  alt: string;
  effect?: TiltEffect;
  className?: string;
  onClick?: (rect: DOMRect) => void;
  lazy?: boolean;
}

export const CardFace = ({ src, alt, effect, className, onClick, lazy = false }: CardFaceProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <TiltCard className={className} effect={effect} onClick={onClick}>
      {lazy && !loaded && !error && <div className="absolute inset-0 animate-pulse" />}
      {error ? (
        <CardBack className="w-full h-full" />
      ) : (
        <img
          src={src}
          alt={alt}
          loading={lazy ? 'lazy' : undefined}
          onLoad={lazy ? () => setLoaded(true) : undefined}
          onError={() => setError(true)}
          className={
            lazy
              ? `w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`
              : 'w-full h-full object-cover'
          }
        />
      )}
    </TiltCard>
  );
};
