import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { projects } from '@/data/projects.js';
import { Button } from '@/components/ui/Button.jsx';
import { Card } from '@/components/ui/Card.jsx';
import { ProjectImage } from '@/components/ui/ProjectImage.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';
import { Tag } from '@/components/ui/Tag.jsx';

export function ProjectsSection() {
  const { t } = useTranslation('common');
  const { t: th } = useTranslation('home');
  const { t: tp } = useTranslation('projects');

  return (
    <Section id="projects" labelledBy="projects-title">
      <Reveal>
        <SectionHeading
          index="03"
          titleId="projects-title"
          title={th('projects.title')}
          lead={th('projects.lead')}
        />
      </Reveal>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {projects.map((project, index) => {
          const title = tp(`items.${project.key}.title`);
          return (
            <Reveal key={project.slug} delay={index * 0.08}>
              <article className="group h-full">
                <Card hover className="h-full overflow-hidden">
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <ProjectImage
                      project={project}
                      title={title}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl font-semibold tracking-tight">
                        {title}
                      </h3>
                      <Tag tone={project.status === 'live' ? 'highlight' : 'default'}>
                        {project.status === 'live'
                          ? t('status.live')
                          : t('status.prototype')}
                      </Tag>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {tp(`items.${project.key}.short`)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Tag key={tech}>{tech}</Tag>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button to={`/projects/${project.slug}`} variant="secondary">
                        {t('buttons.caseStudy')}
                      </Button>
                      {project.liveUrl ? (
                        <Button
                          href={project.liveUrl}
                          variant="ghost"
                          aria-label={`${t('buttons.liveSite')} (${t('a11y.newTab')})`}
                        >
                          <span>{t('buttons.liveSite')}</span>
                          <ExternalLink size={14} aria-hidden="true" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
