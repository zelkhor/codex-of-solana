import { useEffect, useRef, useState, type RefObject } from 'react';
import type { Card, Printing } from '@codex/core';
import { FlipHorizontal2, ChevronDown } from 'lucide-react';
import { TiltCard } from '@/features/cards/ui/TiltCard.tsx';
import { ExpandableText } from '@/shared/ui/ExpandableText.tsx';
import {
  CostIcon,
  AttackIcon,
  DefenseIcon,
  LifeIcon,
  IntellectIcon,
  RarityIcon,
} from '@/features/cards/ui/CardIcons.tsx';
import { FoilingBadge } from '@/features/cards/ui/FoilingBadge.tsx';
import { CardBack } from '@/features/cards/ui/CardBack.tsx';
import { useCardDetailViewModel } from '@/features/cards/use-cases/view-card-details/card-detail.view-model.ts';

interface CardDetailProps {
  card: Card;
  initialPrinting: Printing;
  onBack?: () => void;
  cardImageContainerRef?: RefObject<HTMLDivElement | null>;
  cardImageVisible?: boolean;
}

export const CardDetail = ({
  card,
  initialPrinting,
  onBack,
  cardImageContainerRef,
  cardImageVisible = true,
}: CardDetailProps) => {
  const vm = useCardDetailViewModel(initialPrinting);
  const printingsRef = useRef<HTMLDivElement>(null);
  const [hasMorePrintings, setHasMorePrintings] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const el = printingsRef.current;
    if (!el) return;
    const update = () => setHasMorePrintings(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
    update();
    el.addEventListener('scroll', update);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="px-8 pb-8 pt-8">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to listing
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.6fr] gap-6 items-start">
        {/* Card image — always in DOM so modal height stays stable; opacity hides it during animation */}
        <div
          ref={cardImageContainerRef}
          className="relative w-full max-w-50 mx-auto sm:max-w-none"
          style={{ opacity: cardImageVisible ? 1 : 0 }}
        >
          <TiltCard className="w-full aspect-5/7" effect={vm.tiltEffect}>
            {imgError ? (
              <CardBack className="w-full h-full" />
            ) : (
              <img
                src={vm.activePrinting.image}
                alt={card.name}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover`}
              />
            )}
          </TiltCard>
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <FoilingBadge foiling={vm.activePrinting.foiling} />
          </div>
          {vm.backPrinting && (
            <button
              onClick={vm.flip}
              className="absolute bottom-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              title={vm.isFlipped ? 'Show front' : 'Show back'}
            >
              <FlipHorizontal2 size={18} />
            </button>
          )}
        </div>

        {/* Metadata + printings */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{card.name}</h1>
            {card.typeText && <p className="text-sm text-muted-foreground">{card.typeText}</p>}
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0">
              <dt className="font-medium w-16 shrink-0">ID</dt>
              <dd className="text-muted-foreground font-mono text-xs truncate">
                {vm.activePrinting.identifier}
              </dd>
            </div>

            <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
              <dt className="font-medium w-16 shrink-0">Rarity</dt>
              <dd className="text-muted-foreground flex items-center gap-1.5 truncate">
                <RarityIcon rarity={vm.activePrinting.rarity} />
                {vm.activePrinting.rarity}
              </dd>
            </div>
            {card.classes.length > 0 && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0">
                <dt className="font-medium w-16 shrink-0">Class</dt>
                <dd className="text-muted-foreground truncate">{card.classes.join(', ')}</dd>
              </div>
            )}
            {card.talents.length > 0 && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0">
                <dt className="font-medium w-16 shrink-0">Talent</dt>
                <dd className="text-muted-foreground truncate">{card.talents.join(', ')}</dd>
              </div>
            )}
            {card.types.length > 0 && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0">
                <dt className="font-medium w-16 shrink-0">Type</dt>
                <dd className="text-muted-foreground truncate">{card.types.join(', ')}</dd>
              </div>
            )}
            {!!card.cost && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Cost</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <CostIcon />
                  {card.cost}
                </dd>
              </div>
            )}
            {!!card.pitch && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Pitch</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <CostIcon />
                  {card.pitch}
                </dd>
              </div>
            )}
            {!!card.attack && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Attack</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <AttackIcon />
                  {card.attack}
                </dd>
              </div>
            )}
            {!!card.defense && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Defense</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <DefenseIcon />
                  {card.defense}
                </dd>
              </div>
            )}
            {!!card.life && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Life</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <LifeIcon />
                  {card.life}
                </dd>
              </div>
            )}
            {!!card.intellect && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Intellect</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <IntellectIcon />
                  {card.intellect}
                </dd>
              </div>
            )}
            {card.keywords.length > 0 && (
              <div className="col-span-2 flex gap-2 min-w-0">
                <dt className="font-medium w-16 shrink-0">Keywords</dt>
                <dd className="text-muted-foreground">{card.keywords.join(', ')}</dd>
              </div>
            )}
            {!!card.functionalText && (
              <div className="col-span-2 flex gap-2 min-w-0">
                <dt className="font-medium w-16 shrink-0">Text</dt>
                <dd className="text-muted-foreground min-w-0 flex-1">
                  <ExpandableText text={card.functionalText} />
                </dd>
              </div>
            )}
          </dl>

          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Printings
            </p>
            <div className="relative">
              <div
                ref={printingsRef}
                className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1 pb-4 mask-[linear-gradient(to_bottom,black_calc(100%-20px),transparent)]"
              >
                {card.printings.map((p) => (
                  <button
                    key={p.print}
                    onClick={() => vm.setActivePrinting(p)}
                    className={`text-xs px-2 py-1 rounded-md transition-colors ${
                      p.print === vm.activePrinting.print
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {p.identifier}
                    {` · ${p.set}`}
                    {p.edition ? ` · ${p.edition}` : ''}
                    {p.foiling ? ` · ${p.foiling}` : ''}
                  </button>
                ))}
              </div>
              {hasMorePrintings && (
                <div className="absolute -bottom-3 inset-x-0 flex justify-center pointer-events-none">
                  <ChevronDown
                    size={14}
                    className="text-muted-foreground/70 animate-bounce animation-duration-[1.5s]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
