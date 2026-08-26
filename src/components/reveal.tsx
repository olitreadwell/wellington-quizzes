'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Fades heavy sections up as they enter the viewport.
 *
 * Uses IntersectionObserver, so nothing is animated for users who never see
 * it, and prefers-reduced-motion kills the effect via CSS.
 *
 * @param props - Component props
 * @param props.children - Content to reveal
 * @param props.delayMs - Stagger delay before the reveal starts
 * @returns A div that reveals its children on scroll into view
 */
export function Reveal({ children, delayMs = 0 }: { children: ReactNode; delayMs?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal"
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
