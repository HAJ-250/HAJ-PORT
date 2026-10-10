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
      className="border-y border-border bg-surface/40"
    >
      <Reveal>
        <SectionHeading
          index="02"
          titleId="skills-title"
          title={t('skills.title')}
          lead={t('skills.lead')}
        />
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <Reveal key={group.key} delay={index * 0.06}>
            <Card className="h-full p-5">
              <p className="font-mono text-xs uppercase tracking-wider text-accent">
                {t(`skills.groups.${group.key}`)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Tag key={item}>{group.translateItems ? t(item) : item}</Tag>
                ))}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
