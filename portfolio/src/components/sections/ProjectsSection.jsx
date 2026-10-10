import { ExternalLink, Github } from 'lucide-react';
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
    <Section id="projects" labelledBy="projects-title" className="relative">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] opacity-5">
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="150" r="100" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3">
              <animate attributeName="r" values="100;130;100" dur="8s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>

      <Reveal>
        <SectionHeading
          index="03"
          titleId="projects-title"
          title={th('projects.title')}
          lead={th('projects.lead')}
        />
      </Reveal>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {projects.map((project, index) => {
          const title = tp(`items.${project.key}.title`);
          return (
            <Reveal key={project.slug} delay={index * 0.1}>
              <article className="group h-full">
                <Card hover className="h-full overflow-hidden relative border-border/50 group-hover:border-violet-500/30 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]">
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <ProjectImage
                      project={project}
                      title={title}
                      className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                    <div className="absolute top-4 right-4">
                      <Tag
                        tone={project.status === 'live' ? 'highlight' : 'default'}
                        className={project.status === 'live'
                          ? 'border-violet-400/40 bg-violet-400/10 text-violet-300'
                          : 'border-amber-500/40 bg-amber-500/10 text-amber-300'}
                      >
                        {project.status === 'live' ? t('status.live') : t('status.prototype')}
                      </Tag>
                    </div>
                  </div>
                  <div className="p-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                    <h3 className="font-display text-xl font-semibold tracking-tight text-text group-hover:text-violet-300 transition-colors duration-300">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {tp(`items.${project.key}.short`)}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Tag key={tech} className="border-violet-500/30 bg-violet-500/10 text-violet-300 hover:border-violet-500 hover:bg-violet-500/20">
                          {tech}
                        </Tag>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button to={`/projects/${project.slug}`} variant="secondary" className="group relative overflow-hidden">
                        <span className="relative z-10">{t('buttons.caseStudy')}</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                      </Button>
                      {project.liveUrl ? (
                        <Button
                          href={project.liveUrl}
                          variant="ghost"
                          aria-label={`${t('buttons.liveSite')} ${t('a11y.newTab')}`}
                          className="group relative"
                        >
                          <span className="relative z-10 flex items-center gap-1.5">
                            {t('buttons.liveSite')}
                            <ExternalLink size={13} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
                          </span>
                        </Button>
                      ) : null}
                      {project.repoUrl ? (
                        <Button
                          href={project.repoUrl}
                          variant="ghost"
                          aria-label={`GitHub ${t('a11y.newTab')}`}
                          className="group relative"
                        >
                          <span className="relative z-10 flex items-center gap-1.5">
                            <Github size={13} aria-hidden="true" />
                            <span>Code</span>
                          </span>
                        </Button>
                      ) : (
                        <Tag tone="default" className="border-muted/30 bg-muted/10 text-muted self-center">
                          {tp('labels.repoMissing')}
                        </Tag>
                      )}
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