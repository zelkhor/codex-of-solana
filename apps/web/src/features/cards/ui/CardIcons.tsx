import type { CardRarityT } from '@codex/core';
import { CARD_RARITIES } from '@codex/core';
import attackImg from '@/shared/assets/attack.png';
import defenseImg from '@/shared/assets/defense.png';
import pitchImg from '@/shared/assets/pitch.png';
import lifeImg from '@/shared/assets/life.png';
import intellectImg from '@/shared/assets/intellect.png';

const statIconClass = 'w-4 h-4 object-contain';

export const CostIcon = () => <img src={pitchImg} alt="Cost" className={statIconClass} />;

export const AttackIcon = () => <img src={attackImg} alt="Attack" className={statIconClass} />;

export const DefenseIcon = () => <img src={defenseImg} alt="Defense" className={statIconClass} />;

export const LifeIcon = () => <img src={lifeImg} alt="Life" className={statIconClass} />;

export const IntellectIcon = () => (
  <img src={intellectImg} alt="Intellect" className={statIconClass} />
);

const CircleLetter = ({ letter, fill }: { letter: string; fill: string }) => (
  <svg width="13" height="13" viewBox="0 0 13 13">
    <circle cx="6.5" cy="6.5" r="6" fill={fill} />
    <text
      x="6.5"
      y="9.5"
      textAnchor="middle"
      fontSize="7"
      fontWeight="bold"
      fill="white"
      fontFamily="sans-serif"
    >
      {letter}
    </text>
  </svg>
);

export const RarityIcon = ({ rarity }: { rarity: CardRarityT }) => {
  switch (rarity) {
    case CARD_RARITIES.Basic:
      return <CircleLetter letter="B" fill="#a6acae" />;
    case CARD_RARITIES.Token:
      return <CircleLetter letter="T" fill="#a6acae" />;
    case CARD_RARITIES.Common:
      return <CircleLetter letter="C" fill="#a6acae" />;
    case CARD_RARITIES.Rare:
      return <CircleLetter letter="R" fill="#019ee2" />;
    case CARD_RARITIES.SuperRare:
      return <CircleLetter letter="S" fill="#7e4796" />;
    case CARD_RARITIES.Majestic:
      return (
        <svg width="13" height="13" viewBox="0 0 13 13">
          <circle cx="6.5" cy="6.5" r="6" fill="#dc2626" />
          <text
            x="6.5"
            y="9.5"
            textAnchor="middle"
            fontSize="7"
            fontWeight="bold"
            fill="white"
            fontFamily="sans-serif"
          >
            M
          </text>
        </svg>
      );
    case CARD_RARITIES.Legendary:
      return <CircleLetter letter="L" fill="#cf9f56" />;
    case CARD_RARITIES.Fabled:
      return (
        <svg width="13" height="13" viewBox="0 0 13 13">
          <path d="M6.5 0.5 L10 6.5 L6.5 12.5 L3 6.5 Z" fill="#cf9f56" />
        </svg>
      );
    case CARD_RARITIES.Marvel:
      return (
        <svg width="13" height="13" viewBox="0 0 13 13">
          <path d="M6.5 1.5 L12 11.5 L1 11.5 Z" fill="#7e4796" />
        </svg>
      );
    case CARD_RARITIES.Promo:
      return <CircleLetter letter="P" fill="#28af38" />;
    default:
      return null;
  }
};
