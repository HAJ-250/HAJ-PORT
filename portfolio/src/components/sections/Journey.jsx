import { Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { journey } from '@/data/journey.js';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';

export function Journey() {
  const { t } = useTranslation('home');

  return (
    <Section id="journey" labelledBy="journey-title">
      <Reveal>
        <SectionHeading
          index="05"
          titleId="journey-title"
          title={t('journey.title')}
          lead={t('journey.lead')}
        />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              {t('journey.education')}
            </h3>
            <ol className="relative mt-6 space-y-8 border-l border-border pl-8">
              {journey.education.map((item) => (
                <li key={item.institution} className="relative">
                  <span
                    className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background"
                    aria-hidden="true"
                  />
                  <p className="font-mono text-xs text-accent">
                    {t(`journey.levels.${item.levelKey}`)}
                  </p>
                  <p className="mt-1 font-display text-base font-semibold">
                    {item.institution}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <div className="space-y-8">
          <Reveal delay={0.05}>
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {t('journey.certificates')}
              </h3>
              <ul className="mt-6 space-y-4">
                {journey.certificates.map((cert) => (
                  <li key={cert.issuer} className="flex items-start gap-3">
                    <Award
                      size={18}
                      className="mt-0.5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium">{t(cert.titleKey)}</p>
                      <p className="text-sm text-muted">{cert.issuer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="p-5">
              <p className="font-mono text-xs uppercase tracking-wider text-accent">
                {t('journey.practice')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t('journey.practiceNote')}
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
