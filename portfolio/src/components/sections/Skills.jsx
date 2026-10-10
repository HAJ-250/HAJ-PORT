import { useTranslation } from 'react-i18next';
import { skillGroups } from '@/data/skills.js';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';
import { Tag } from '@/components/ui/Tag.jsx';

export function Skills() {
  const { t } = useTranslation('home');

  return (
    <Section
      id="skills"
      labelledBy="skills-title"
      className="relative border-y border-border/50 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] opacity-10">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="150" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3">
              <animate attributeName="r" values="150;180;150" dur="10s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>

      <Reveal>
        <SectionHeading
          index="02"
          titleId="skills-title"
          title={t('skills.title')}
          lead={t('skills.lead')}
        />
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <Reveal key={group.key} delay={index * 0.08}>
            <Card className="h-full p-6 relative overflow-hidden group border-border/50 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              <div className="relative flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse-glow" aria-hidden="true" />
                <p className="font-mono text-xs uppercase tracking-wider text-violet-400">
                  {t(`skills.groups.${group.key}`)}
                </p>
              </div>
              <div className="relative flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Tag
                    key={item}
                    tone={group.key === 'projectStack' ? 'highlight' : group.key === 'learning' ? 'default' : 'accent'}
                    className={group.key === 'projectStack'
                      ? 'border-violet-400/40 bg-violet-400/10 text-violet-300'
                      : group.key === 'learning'
                        ? 'border-muted/30 bg-muted/10 text-muted'
                        : 'border-violet-500/40 bg-violet-500/10 text-violet-300'}
                  >
                    {group.translateItems ? t(item) : item}
                  </Tag>
                ))}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}