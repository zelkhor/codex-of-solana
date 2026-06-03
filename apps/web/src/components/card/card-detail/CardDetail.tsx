import type { RefObject } from 'react';
import type { Card, Printing } from '@codex/core';
import { FlipHorizontal2 } from 'lucide-react';
import { TiltCard } from '@/components/card/TiltCard';
import { useCardDetailViewModel } from './card-detail.view-model';
import { ExpandableText } from '@/components/ui/ExpandableText';
import {
  CostIcon,
  AttackIcon,
  DefenseIcon,
  LifeIcon,
  IntellectIcon,
  RarityIcon,
} from '@/components/ui/CardIcons';

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

  return (
    <div className="p-6">
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
          <TiltCard className="w-full aspect-5/7 rounded-[17px]" effect={vm.tiltEffect}>
            <img
              src={vm.activePrinting.image}
              alt={card.name}
              className="w-full h-full rounded-lg object-cover"
            />
          </TiltCard>
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
            {card.cost !== undefined && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Cost</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <CostIcon />
                  {card.cost}
                </dd>
              </div>
            )}
            {card.pitch !== undefined && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Pitch</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <CostIcon />
                  {card.pitch}
                </dd>
              </div>
            )}
            {card.attack !== undefined && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Attack</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <AttackIcon />
                  {card.attack}
                </dd>
              </div>
            )}
            {card.defense !== undefined && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Defense</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <DefenseIcon />
                  {card.defense}
                </dd>
              </div>
            )}
            {card.life !== undefined && (
              <div className="col-span-2 md:col-span-1 flex gap-2 min-w-0 items-center">
                <dt className="font-medium w-16 shrink-0">Life</dt>
                <dd className="text-muted-foreground flex items-center gap-1.5">
                  <LifeIcon />
                  {card.life}
                </dd>
              </div>
            )}
            {card.intellect !== undefined && (
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
            {card.functionalText && (
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
            <div className="flex flex-wrap gap-2">
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
                  {p.set}
                  {p.edition ? ` · ${p.edition}` : ''}
                  {p.foiling ? ` · ${p.foiling}` : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
