import { useState, useRef, useLayoutEffect } from 'react';

interface ExpandableTextProps {
  text: string;
}

export const ExpandableText = ({ text }: ExpandableTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight);
  }, [text]);

  return (
    <>
      <p ref={ref} className={`whitespace-pre-line${!expanded ? ' line-clamp-4' : ''}`}>
        {text}
      </p>
      {(isClamped || expanded) && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-primary text-xs mt-0.5 hover:underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </>
  );
};
