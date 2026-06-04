import { useState, useRef, useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils.ts';

export type TiltEffect = 'standard' | 'rainbow-foil' | 'cold-foil' | 'gold-foil';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  onClick?: (rect: DOMRect) => void;
  effect?: TiltEffect;
}

const RainbowFoilOverlay = ({ mouse }: { mouse: { x: number; y: number } | null }) => {
  const lastPos = useRef({ x: 0.5, y: 0.5 });
  if (mouse) lastPos.current = mouse;
  const pos = mouse ?? lastPos.current;

  const hue = pos.x * 360;
  const angle = 135 + (pos.x - 0.5) * 90;

  return (
    <>
      <div
        className="absolute inset-0 rounded-sm md:rounded-xl lg:rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(
            ${angle}deg,
            hsl(${hue}deg 80% 55%),
            hsl(${hue + 90}deg 80% 55%),
            hsl(${hue + 180}deg 80% 55%),
            hsl(${hue + 270}deg 80% 55%)
          )`,
          opacity: mouse ? 0.28 : 0,
          mixBlendMode: 'color',
        }}
      />
      <div
        className="absolute inset-0 rounded-sm md:rounded-xl lg:rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at ${pos.x * 100}% ${pos.y * 100}%, rgba(255,255,255,0.45) 0%, transparent 50%)`,
          mixBlendMode: 'overlay',
          opacity: mouse ? 0.45 : 0,
        }}
      />
    </>
  );
};

const ColdFoilOverlay = ({ mouse }: { mouse: { x: number; y: number } | null }) => {
  const lastPos = useRef({ x: 0.5, y: 0.5 });
  if (mouse) lastPos.current = mouse;
  const pos = mouse ?? lastPos.current;
  const uid = useId();
  const filterId = `cf${uid.replace(/[^a-zA-Z0-9]/g, '')}`;

  const angle = 135 + (pos.x - 0.5) * 90;

  return (
    <>
      {/* Fractal noise — organic non-repeating texture that blends with card art */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter
            id={filterId}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.65 0.65" numOctaves="4" seed="8" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute inset-0 rounded-sm md:rounded-xl lg:rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          filter: `url(#${filterId})`,
          mixBlendMode: 'soft-light',
          opacity: mouse ? 0.65 : 0,
        }}
      />

      {/* Metallic sheen sweep */}
      <div
        className="absolute inset-0 rounded-sm md:rounded-xl lg:rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(
            ${angle}deg,
            rgba(160, 185, 210, 0.55),
            rgba(210, 228, 248, 0.75),
            rgba(190, 210, 230, 0.5),
            rgba(130, 160, 190, 0.45)
          )`,
          mixBlendMode: 'overlay',
          opacity: mouse ? 0.9 : 0,
        }}
      />

      {/* Specular highlight */}
      <div
        className="absolute inset-0 rounded-sm md:rounded-xl lg:rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at ${pos.x * 100}% ${pos.y * 100}%, rgba(220, 240, 255, 0.85) 0%, rgba(195, 220, 255, 0.4) 20%, transparent 55%)`,
          mixBlendMode: 'overlay',
          opacity: mouse ? 0.95 : 0,
        }}
      />
    </>
  );
};

const GoldFoilOverlay = ({ mouse }: { mouse: { x: number; y: number } | null }) => {
  const lastPos = useRef({ x: 0.5, y: 0.5 });
  if (mouse) lastPos.current = mouse;
  const pos = mouse ?? lastPos.current;
  const uid = useId();
  const filterId = `gf${uid.replace(/[^a-zA-Z0-9]/g, '')}`;

  const angle = 135 + (pos.x - 0.5) * 90;

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter
            id={filterId}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.55 0.55" numOctaves="4" seed="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute inset-0 rounded-sm md:rounded-xl lg:rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          filter: `url(#${filterId})`,
          mixBlendMode: 'soft-light',
          opacity: mouse ? 0.75 : 0,
        }}
      />

      {/* Warm gold sheen sweep */}
      <div
        className="absolute inset-0 rounded-sm md:rounded-xl lg:rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(
            ${angle}deg,
            rgba(180, 140, 40, 0.55),
            rgba(255, 215, 80, 0.75),
            rgba(220, 175, 55, 0.50),
            rgba(160, 115, 30, 0.45)
          )`,
          mixBlendMode: 'overlay',
          opacity: mouse ? 0.8 : 0,
        }}
      />

      {/* Specular highlight */}
      <div
        className="absolute inset-0 rounded-sm md:rounded-xl lg:rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at ${pos.x * 100}% ${pos.y * 100}%, rgba(255, 245, 180, 1.0) 0%, rgba(240, 205, 90, 0.55) 18%, transparent 40%)`,
          mixBlendMode: 'overlay',
          opacity: mouse ? 0.95 : 0,
        }}
      />
    </>
  );
};

export const TiltCard = ({ children, className, onClick, effect = 'standard' }: TiltCardProps) => {
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const rotateX = mouse ? (0.5 - mouse.y) * 18 : 0;
  const rotateY = mouse ? (mouse.x - 0.5) * 18 : 0;

  return (
    <div
      ref={containerRef}
      style={{ perspective: '600px' }}
      onClick={() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) onClick?.(rect);
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMouse({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }}
      onMouseLeave={() => setMouse(null)}
    >
      <div
        className={cn('relative w-full h-full overflow-hidden', className)}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: mouse ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {children}
        {effect === 'rainbow-foil' && <RainbowFoilOverlay mouse={mouse} />}
        {effect === 'cold-foil' && <ColdFoilOverlay mouse={mouse} />}
        {effect === 'gold-foil' && <GoldFoilOverlay mouse={mouse} />}
      </div>
    </div>
  );
};
