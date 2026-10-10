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
    const duration = 900;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced]);

  return <span ref={ref}>{display}</span>;
}

export function Stats() {
  const { t } = useTranslation('home');

  // All counts are computed from real data arrays — never typed in.
  const stats = [
    {
      key: 'featuredProjects',
      value: projects.filter((p) => p.featured).length,
    },
    { key: 'certificates', value: journey.certificates.length },
    { key: 'siteLanguages', value: SUPPORTED_LANGUAGES.length },
    {
      key: 'programmingLanguages',
      value: skillGroups.find((g) => g.key === 'languages').items.length,
    },
  ];

  return (
    <Section
      id="stats"
      labelledBy="stats-title"
      className="border-y border-border bg-surface/40"
    >
      <Reveal>
        <SectionHeading
          index="06"
          titleId="stats-title"
          title={t('stats.title')}
          lead={t('stats.lead')}
        />
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.key} delay={index * 0.06}>
            <div className="rounded-xl border border-border bg-surface p-6 text-center">
              <p className="font-display text-4xl font-bold tracking-tight text-accent sm:text-5xl">
                <Counter value={stat.value} />
              </p>
              <p className="mt-2 text-sm text-muted">{t(`stats.${stat.key}`)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
