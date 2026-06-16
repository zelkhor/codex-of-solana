import { type ReactNode } from 'react';

interface FlipContainerProps {
  isFlipped: boolean;
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export const FlipContainer = ({ isFlipped, front, back, className }: FlipContainerProps) => (
  <div className={className} style={{ perspective: '1200px' }}>
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.6s ease-in-out',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className={isFlipped ? 'pointer-events-none' : undefined}
      >
        {front}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
        className={!isFlipped ? 'pointer-events-none' : undefined}
      >
        {back}
      </div>
    </div>
  </div>
);
