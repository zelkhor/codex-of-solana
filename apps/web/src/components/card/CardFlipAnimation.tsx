import { type RefObject, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import cardBackImg from '../../assets/flesh-back.png';

interface CardFlipAnimationProps {
  imageUrl: string;
  sourceRect: DOMRect;
  targetRef: RefObject<HTMLElement | null>;
  onComplete: () => void;
}

export const CardFlipAnimation = ({
  imageUrl,
  sourceRect,
  targetRef,
  onComplete,
}: CardFlipAnimationProps) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const targetW = Math.min(vw * 0.22, 240);
  const targetH = targetW * (7 / 5);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let cancelled = false;

    void document.fonts.ready.then(() => {
      if (cancelled) return;

      const targetRect = targetRef.current?.getBoundingClientRect();
      if (!targetRect) {
        onComplete();
        return;
      }

      const startX = sourceRect.left + sourceRect.width / 2 - vw / 2;
      const startY = sourceRect.top + sourceRect.height / 2 - vh / 2;
      const startScale = sourceRect.width / targetW;

      const endX = targetRect.left + targetRect.width / 2 - vw / 2;
      const endY = targetRect.top + targetRect.height / 2 - vh / 2;
      const endScale = targetRect.width / targetW;

      const midX = startX + (endX - startX) * 0.35;
      const midY = startY + (endY - startY) * 0.35;
      const midScale = Math.max(Math.min(startScale, endScale) * 0.85, 0.6);

      const posAnim = outer.animate(
        [
          {
            transform: `translate(${startX}px, ${startY}px) scale(${startScale})`,
            offset: 0,
            easing: 'cubic-bezier(0.4, 0, 1, 1)',
          },
          {
            transform: `translate(${midX}px, ${midY}px) scale(${midScale})`,
            offset: 0.4,
            easing: 'cubic-bezier(0, 0, 0.2, 1)',
          },
          { transform: `translate(${endX}px, ${endY}px) scale(${endScale})`, offset: 1 },
        ],
        { duration: 1000, easing: 'linear', fill: 'forwards' },
      );

      inner.animate(
        [
          { transform: 'perspective(900px) rotateY(0deg)', offset: 0 },
          { transform: 'perspective(900px) rotateY(360deg)', offset: 1 },
        ],
        { duration: 1000, easing: 'cubic-bezier(0.4, 0, 0.6, 1)', fill: 'forwards' },
      );

      posAnim.onfinish = onComplete;
    });

    return () => {
      cancelled = true;
    };
  }, [sourceRect, targetRef, onComplete, vw, vh, targetW]);

  return createPortal(
    <div
      ref={outerRef}
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        width: targetW,
        height: targetH,
        marginLeft: -targetW / 2,
        marginTop: -targetH / 2,
        zIndex: 200,
        pointerEvents: 'none',
        borderRadius: 12,
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <img
            src={imageUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            alt="Card front"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <img
            src={cardBackImg}
            alt="Card back"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};
