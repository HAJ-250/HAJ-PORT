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
    <Section id="about" labelledBy="about-title">
      <Reveal>
        <SectionHeading
          index="01"
          titleId="about-title"
          title={t('about.title')}
          lead={t('about.lead')}
        />
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <Reveal delay={0.05}>
          <ul className="space-y-4">
            {t('about.points', { returnObjects: true }).map((point, index) => (
              <li key={index} className="flex gap-3">
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <p className="leading-relaxed text-muted">{point}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="h-full p-6">
            <div className="space-y-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">
                  {t('about.locationLabel')}
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold">{site.location}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">
                  {t('about.strengthsLabel')}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {t('about.strengths', { returnObjects: true }).map((strength) => (
                    <Tag key={strength} tone="accent">
                      {strength}
                    </Tag>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">
                  {t('about.workStyleLabel')}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {t('about.workStyle', { returnObjects: true }).map((style) => (
                    <Tag key={style}>{style}</Tag>
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
