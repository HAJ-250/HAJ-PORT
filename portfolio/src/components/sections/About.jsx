import { useTranslation } from 'react-i18next';
import { site } from '@/data/site.js';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';
import { Tag } from '@/components/ui/Tag.jsx';

export function About() {
  const { t } = useTranslation('home');

  return (
    <Section id="about" labelledBy="about-title" className="relative">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] opacity-5">
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="150" r="120" stroke="url(#violetGradient)" strokeWidth="1" opacity="0.3">
              <animate attributeName="r" values="120;140;120" dur="8s" repeatCount="indefinite" />
            </circle>
            <defs>
              <linearGradient id="violetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <Reveal>
        <SectionHeading
          index="01"
          titleId="about-title"
          title={t('about.title')}
          lead={t('about.lead')}
        />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <Reveal delay={0.05}>
          <div className="space-y-6">
            {t('about.points', { returnObjects: true }).map((point, index) => (
              <div key={index} className="flex gap-4">
                <div className="relative flex-shrink-0 mt-2">
                  <span className="h-2 w-2 rounded-full bg-violet-500" aria-hidden="true" />
                  <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full border border-violet-500/30 animate-pulse-glow" aria-hidden="true" />
                </div>
                <p className="leading-relaxed text-muted">{point}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="h-full p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
            <div className="relative space-y-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                  {t('about.locationLabel')}
                </p>
                <p className="font-display text-xl font-semibold text-text">{site.location}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                  {t('about.strengthsLabel')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {t('about.strengths', { returnObjects: true }).map((strength) => (
                    <Tag key={strength} tone="accent" className="border-violet-500/40 bg-violet-500/10 text-violet-300">
                      {strength}
                    </Tag>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                  {t('about.workStyleLabel')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {t('about.workStyle', { returnObjects: true }).map((style) => (
                    <Tag key={style} className="border-violet-500/20 bg-violet-500/5 text-violet-200">
                      {style}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}