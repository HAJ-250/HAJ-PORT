import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useScrollSpy } from '@/hooks/useScrollSpy.js';
import { useReducedMotion } from '@/hooks/useReducedMotion.js';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher.jsx';
import { ThemeToggle } from '@/components/ui/ThemeToggle.jsx';
import { site } from '@/data/site.js';
import { HAJWordmark } from '@/components/ui/HAJWordmark.jsx';

const NAV_IDS = ['about', 'skills', 'projects', 'journey', 'contact'];

export function Navbar() {
  const { t } = useTranslation();
  const { t: tc } = useTranslation('common');
  const active = useScrollSpy(NAV_IDS);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoAnimated, setLogoAnimated] = useState(false);

  const links = NAV_IDS.map((id) => ({ id, label: t(`nav.${id}`) }));

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLogoAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="fixed inset-x-0 top-3 z-50">
      <nav className="mx-auto w-full max-w-7xl px-4" aria-label={t('nav.main')}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`relative flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-surface/80 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur-md transition-all duration-300 ${
            scrolled
              ? 'bg-surface/95 border-border/80 shadow-2xl shadow-black/20'
              : ''
          }`}
        >
          <a
            href="#top"
            className="relative flex min-h-[48px] items-center gap-3 pr-2 group"
            aria-label={`${site.nickname} ${site.name} — ${site.title}`}
          >
            <motion.div
              initial={false}
              animate={{ scale: logoAnimated ? 1 : 0.8, opacity: logoAnimated ? 1 : 0, y: logoAnimated ? 0 : -10 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="relative"
            >
              <HAJWordmark size="nav" animate={false} />
            </motion.div>
            {' '}
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:block text-text">
              {site.name}
            </span>
            <motion.span
              initial={false}
              animate={{ width: logoAnimated ? '60px' : '0', opacity: logoAnimated ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="absolute bottom-0 left-8 h-0.5 bg-gradient-to-r from-violet-500 to-transparent rounded-full overflow-hidden"
              aria-hidden="true"
            />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="relative rounded-full px-4 py-2 text-sm font-medium text-muted transition-all duration-200 hover:text-text"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full border border-border bg-elevated/50"
                        transition={reduced ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                    <motion.span
                      initial={false}
                      animate={{ width: isActive ? '100%' : '0' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-violet-500 to-violet-400 rounded-full"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden md:flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200"
              aria-label={tc('buttons.letsTalk')}
            >
              <MessageSquare size={16} aria-hidden="true" />
              <span>{tc('buttons.letsTalk')}</span>
            </a>
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
        </motion.div>

        <MobileMenu open={open} onClose={() => setOpen(false)} links={links} />
      </nav>
    </header>
  );
}

function MobileMenu({ open, onClose, links }) {
  const { t } = useTranslation();
  const { t: tc } = useTranslation('common');
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
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-x-4 top-4 rounded-2xl border border-border bg-surface p-4 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HAJWordmark size="nav" animate={false} />
                <span className="font-display text-lg font-semibold">{site.name}</span>
              </div>
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
            <a
              href="#contact"
              onClick={onClose}
              className="mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2 font-display text-lg font-medium text-white shadow-lg shadow-violet-500/25"
            >
              <MessageSquare size={20} aria-hidden="true" />
              <span>{tc('buttons.letsTalk')}</span>
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}