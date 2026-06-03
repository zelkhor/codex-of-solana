import cardBackImg from '../../assets/flesh-back.png';

export const CardBack = ({ className }: { className?: string }) => (
  <img
    src={cardBackImg}
    alt="Card back"
    className={`aspect-5/7 rounded-lg object-cover ${className ?? ''}`}
  />
);
