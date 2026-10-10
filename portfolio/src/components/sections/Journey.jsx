import { Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { journey } from '@/data/journey.js';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';
import { Tag } from '@/components/ui/Tag.jsx';

export function Journey() {
  const { t } = useTranslation('home');

  return (
    <Section id="journey" labelledBy="journey-title" className="relative">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] opacity-5">
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="150" r="120" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3">
              <animate attributeName="r" values="120;150;120" dur="10s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>

      <Reveal>
        <SectionHeading
          index="04"
          titleId="journey-title"
          title={t('journey.title')}
          lead={t('journey.lead')}
        />
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <h3 className="font-display text-lg font-semibold tracking-tight text-text mb-6">
              {t('journey.education')}
            </h3>
            <ol className="relative space-y-8">
              <li className="relative pl-8" aria-hidden="true">
                <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent" />
              </li>
              {journey.education.map((item, index) => (
                <li key={item.institution} className="relative pl-8">
                  <div className="absolute left-[-6px] top-2 h-3 w-3 rounded-full border-2 border-violet-500 bg-background relative z-10" aria-hidden="true">
                    <div className="absolute inset-1.5 rounded-full bg-violet-500/20 animate-pulse-glow" />
                  </div>
                  <p className="font-mono text-xs text-violet-400 mb-1">
                    {t(`journey.levels.${item.levelKey}`)}
                  </p>
                  <p className="font-display text-base font-semibold text-text">{item.institution}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Tag tone="default" className="border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs">
                      {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Technical'}
                    </Tag>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <div className="space-y-8">
          <Reveal delay={0.05}>
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-text mb-6">
                {t('journey.certificates')}
              </h3>
              <ul className="space-y-4">
                {journey.certificates.map((cert) => (
                  <li key={cert.issuer} className="group relative">
                    <Card className="p-5 flex items-start gap-4 hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300">
                      <div className="relative flex-shrink-0">
                        <Award size={22} className="text-violet-500" aria-hidden="true" />
                        <div className="absolute -inset-1 rounded-full border border-violet-500/20 animate-pulse-glow" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text">{t(cert.titleKey)}</p>
                        <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="p-6 relative overflow-hidden border-border/50 hover:border-violet-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent" aria-hidden="true" />
              <div className="relative flex items-center gap-2 mb-3">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse-glow" aria-hidden="true" />
                <p className="font-mono text-xs uppercase tracking-wider text-violet-400">
                  {t('journey.practice')}
                </p>
              </div>
              <p className="relative leading-relaxed text-muted">{t('journey.practiceNote')}</p>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}