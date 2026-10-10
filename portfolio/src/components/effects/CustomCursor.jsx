import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion.js';

/**
 * Subtle pointer-following ring. Only enabled for fine pointers
 * (mouse/stylus) when the user has not requested reduced motion.
 * The native cursor is never hidden.
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef(null);
  const position = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    setEnabled(true);
    let raf;

    const onMove = (event) => {
      target.current = { x: event.clientX, y: event.clientY };
    };

    const onOver = (event) => {
      const interactive = event.target.closest(
        'a, button, input, textarea, select, [role="button"], label[tabindex]',
      );
      document.body.classList.toggle('cursor-ring-hover', Boolean(interactive));
    };

    const loop = () => {
      position.current.x += (target.current.x - position.current.x) * 0.18;
      position.current.y += (target.current.y - position.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      cancelAnimationFrame(raf);
      document.body.classList.remove('cursor-ring-hover');
    };
  }, [reduced]);

  if (!enabled) return null;

  return (
    <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
  );
}
