import { useId, useRef } from 'react';

import type { CardFoilingT } from '@codex/core';
import { CARD_FOILINGS } from '@codex/core';

interface FoilingBadgeProps {
  foiling: CardFoilingT;
}

export const FoilingBadge = ({ foiling }: FoilingBadgeProps) => {
  const id = useId();
  const shineDelay = useRef(`${(Math.random() * 2.5).toFixed(2)}s`);
  const rainbowId = `${id}-rainbow`;
  const coldId = `${id}-cold`;
  const goldId = `${id}-gold`;
  const shineId = `${id}-shine`;
  const coldShineId = `${id}-cold-shine`;
  const clipId = `${id}-clip`;

  if (foiling === CARD_FOILINGS.Regular) return <></>;

  const isRainbow = foiling === CARD_FOILINGS.Rainbow;
  const isCold = foiling === CARD_FOILINGS.Cold;
  const fillId = isRainbow ? rainbowId : isCold ? coldId : goldId;

  return (
    <div className="bg-white dark:bg-gray-600/55 rounded-full p-1 ring-1 ring-black/5 dark:ring-white/20 drop-shadow-xl shadow-lg">
      <svg width="18" height="18" viewBox="0 0 32 32" aria-label={`${foiling} foil`}>
        <defs>
          <linearGradient id={rainbowId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="33%" stopColor="#818cf8" />
            <stop offset="66%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id={coldId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#bae6fd" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#f0f9ff" />
          </linearGradient>
          <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id={shineId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.65" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={coldShineId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
          <clipPath id={clipId}>
            <polygon points="10,2 22,2 31,13 16,30 1,13" />
          </clipPath>
        </defs>

        {/* main diamond body */}
        <polygon points="10,2 22,2 31,13 16,30 1,13" fill={`url(#${fillId})`} />

        {/* crown highlight (table facet — light source top-right) */}
        <polygon points="10,2 22,2 16,13" fill="rgba(255,255,255,0.18)" />

        {/* shadow — left crown facet */}
        <polygon points="1,13 10,2 16,13" fill="rgba(0,0,0,0.18)" />
        {/* shadow — left pavilion (deepest, light blocked) */}
        <polygon points="1,13 16,13 16,30" fill="rgba(0,0,0,0.22)" />
        {/* shadow — right pavilion (lighter) */}
        <polygon points="31,13 16,13 16,30" fill="rgba(0,0,0,0.10)" />

        {/* facet lines — blue-gray on cold (white gets lost on light bg), white on others */}
        <line
          x1="10"
          y1="2"
          x2="16"
          y2="13"
          stroke={isCold ? 'rgba(56,189,248,0.8)' : 'rgba(255,255,255,0.55)'}
          strokeWidth="1.2"
        />
        <line
          x1="22"
          y1="2"
          x2="16"
          y2="13"
          stroke={isCold ? 'rgba(56,189,248,0.8)' : 'rgba(255,255,255,0.55)'}
          strokeWidth="1.2"
        />
        <line
          x1="1"
          y1="13"
          x2="31"
          y2="13"
          stroke={isCold ? 'rgba(56,189,248,0.65)' : 'rgba(255,255,255,0.45)'}
          strokeWidth="1.2"
        />
        <line
          x1="16"
          y1="13"
          x2="16"
          y2="30"
          stroke={isCold ? 'rgba(56,189,248,0.55)' : 'rgba(255,255,255,0.35)'}
          strokeWidth="1.2"
        />

        {/* sun-glint sweep — clips to diamond, pauses between passes */}
        <rect
          x="-14"
          y="0"
          width="14"
          height="32"
          fill={`url(#${isCold ? coldShineId : shineId})`}
          clipPath={`url(#${clipId})`}
        >
          <animate
            attributeName="x"
            values="-14;32;32"
            keyTimes="0;0.2;1"
            dur="2.5s"
            begin={shineDelay.current}
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
};
