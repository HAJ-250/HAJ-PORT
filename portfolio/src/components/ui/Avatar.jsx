import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion.js';

/**
 * Owner's photo with premium portrait frame and subtle glow.
 * Falls back to an intentional "HAJ" monogram if image fails.
 */
export function Avatar({ className = '', size = 'hero' }) {
  const { t } = useTranslation('home');
  const [failed, setFailed] = useState(false);
  const alt = t('hero.avatarAlt');
  const reduced = useReducedMotion();

  const sizeClasses = {
    hero: 'h-64 w-64 sm:h-72 sm:w-72 lg:h-80 lg:w-80',
    nav: 'h-10 w-10',
    footer: 'h-20 w-20',
  };

  const fallback = (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-elevated to-surface font-display text-5xl font-bold tracking-wide text-accent ${className}`}
    >
      HAJ
    </div>
  );

  if (failed) {
    return fallback;
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-violet-500/30 via-transparent to-purple-600/30 blur-2xl opacity-60 ${reduced ? 'transition-none' : 'transition-opacity duration-700'}`}
        aria-hidden="true"
      />
      <div
        className={`absolute inset-0 rounded-[2.5rem] border border-violet-500/30 bg-gradient-to-tr from-violet-500/10 to-transparent ${reduced ? 'transition-none' : 'transition-all duration-700'}`}
        aria-hidden="true"
      />
      <motion.img
        src="/images/haj.png"
        alt={alt}
        width={400}
        height={400}
        loading="eager"
        onError={() => setFailed(true)}
        className={`${sizeClasses[size]} rounded-[2.5rem] border border-border/50 bg-surface object-cover relative z-10 ${reduced ? 'transition-none' : 'transition-all duration-700 hover:scale-[1.02] hover:border-violet-500/50'}`}
        initial={false}
        animate={reduced ? {} : { boxShadow: ['0 0 0 0 transparent', '0 0 60px -10px rgba(139, 92, 246, 0.4)', '0 0 0 0 transparent'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'box-shadow, transform' }}
      />
      <div
        className="absolute -inset-2 rounded-[2.7rem] border border-violet-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
  );
}
