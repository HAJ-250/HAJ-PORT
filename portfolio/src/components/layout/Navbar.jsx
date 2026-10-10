import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useScrollSpy } from '@/hooks/useScrollSpy.js';
import { useReducedMotion } from '@/hooks/useReducedMotion.js';
import { Monogram } from '@/components/ui/Monogram.jsx';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher.jsx';
import { ThemeToggle } from '@/components/ui/ThemeToggle.jsx';
import { site } from '@/data/site.js';

const NAV_IDS = ['about', 'skills', 'projects', 'journey', 'contact'];

export function Navbar() {
  const { t } = useTranslation();
  const active = useScrollSpy(NAV_IDS);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  const links = NAV_IDS.map((id) => ({ id, label: t(`nav.${id}`) }));

  return (
    <header className="fixed inset-x-0 top-3 z-50">
      <nav className="mx-auto w-full max-w-3xl px-3" aria-label={t('nav.main')}>
        <div className="flex items-center justify-between gap-2 rounded-full border border-border bg-surface/80 px-3 py-2 shadow-lg shadow-black/5 backdrop-blur-md">
          <a
            href="#top"
            className="flex min-h-[44px] items-center gap-2 pr-1"
            aria-label={`${site.name} — ${site.title}`}
          >
            <Monogram size={28} />
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">
              {site.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="relative rounded-full px-3 py-2 text-sm text-muted transition-colors duration-150 hover:text-text"
                  >
                    {isActive &&
                      (reduced ? (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full border border-border bg-elevated"
                        />
                      ) : (
                        <motion.span
                          layoutId="nav-active-pill"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full border border-border bg-elevated"
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                        />
                      ))}
                    <span className="relative z-10">{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted hover:bg-elevated hover:text-text md:hidden"
              onClick={() => setOpen(true)}
              aria-label={t('nav.openMenu')}
              aria-expanded={open}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={open} onClose={() => setOpen(false)} links={links} />
    </header>
  );
}

function MobileMenu({ open, onClose, links }) {
  const { t } = useTranslation();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 60);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll('a[href], button:not([disabled])'),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.openMenu')}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-background/95 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-x-3 top-3 rounded-2xl border border-border bg-surface p-4 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-sm font-semibold">{site.name}</span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t('nav.closeMenu')}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted hover:bg-elevated hover:text-text"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <ul className="flex flex-col">
              {links.map(({ id, label }) => (
                <li key={id} className="border-t border-border first:border-0">
                  <a
                    href={`#${id}`}
                    onClick={onClose}
                    className="flex min-h-[48px] items-center px-2 font-display text-lg text-text hover:text-accent"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
