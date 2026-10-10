import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n/index.js';
import { journey } from '@/data/journey.js';
import { projects } from '@/data/projects.js';
import { skillGroups } from '@/data/skills.js';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';
import { useReducedMotion } from '@/hooks/useReducedMotion.js';
import { Card } from '@/components/ui/Card.jsx';
import { Tag } from '@/components/ui/Tag.jsx';

function Counter({ value }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setDisplay(value);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced]);

  return <span ref={ref} className="font-display font-bold tracking-tight text-violet-400">{display}</span>;
}

export function Stats() {
  const { t } = useTranslation('home');

  // All counts are computed from real data arrays — never typed in.
  const stats = [
    {
      key: 'featuredProjects',
      value: projects.filter((p) => p.featured).length,
      icon: '🚀',
    },
    { key: 'certificates', value: journey.certificates.length, icon: '🏆' },
    { key: 'siteLanguages', value: SUPPORTED_LANGUAGES.length, icon: '🌐' },
    {
      key: 'programmingLanguages',
      value: skillGroups.find((g) => g.key === 'languages').items.length,
      icon: '💻',
    },
  ];

  return (
    <Section
      id="stats"
      labelledBy="stats-title"
      className="relative border-y border-border/50 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] opacity-5">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="160" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3">
              <animate attributeName="r" values="160;200;160" dur="12s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>

      <Reveal>
        <SectionHeading
          index="06"
          titleId="stats-title"
          title={t('stats.title')}
          lead={t('stats.lead')}
          align="center"
        />
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.key} delay={index * 0.08}>
            <Card className="p-6 text-center relative overflow-hidden border-border/50 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] group transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              <div className="relative flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl" aria-hidden="true">{stat.icon}</span>
                <Tag tone="highlight" className="border-violet-400/40 bg-violet-400/10 text-violet-300 text-xs">
                  STAT
                </Tag>
              </div>
              <p className="relative text-4xl sm:text-5xl">
                <Counter value={stat.value} />
              </p>
              <p className="mt-2 text-sm text-muted">{t(`stats.${stat.key}`)}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}