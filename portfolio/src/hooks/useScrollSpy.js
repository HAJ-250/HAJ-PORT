import { useEffect, useState } from 'react';

/**
 * Scroll-spy: returns the id of the section currently in view.
 * Used by the navbar's sliding indicator and aria-current.
 */
export function useScrollSpy(ids, offset = 120) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: `-${offset}px 0px -55% 0px` },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(','), offset]);

  return activeId;
}
