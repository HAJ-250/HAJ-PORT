import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getProjectBySlug, projects } from '@/data/projects.js';
import { Seo } from '@/lib/seo.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { ProjectImage } from '@/components/ui/ProjectImage.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Tag } from '@/components/ui/Tag.jsx';
import { NotFound } from '@/pages/NotFound.jsx';

function Block({ title, children }) {
  return (
    <div>
      <h3 className="font-mono text-sm text-accent">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function screenshotSlot(project, n) {
  return {
    slug: project.slug,
    image: `/images/projects/${project.slug}-${n}.jpg`,
  };
}

export function ProjectPage() {
  const { slug } = useParams();
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('projects');

  const project = getProjectBySlug(slug);

  if (!project) {
    return <NotFound />;
  }

  const item = tp(`items.${project.key}`);
  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <Seo
        title={item.title}
        description={item.short}
        path={`projects/${project.slug}`}
      />
      <section className="pb-24 pt-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-accent"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              {t('buttons.backToProjects')}
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    {item.title}
                  </h1>
                  <Tag tone={project.status === 'live' ? 'highlight' : 'default'}>
                    {project.status === 'live'
                      ? t('status.live')
                      : t('status.prototype')}
                  </Tag>
                </div>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {item.short}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {project.liveUrl ? (
                  <Button
                    href={project.liveUrl}
                    aria-label={`${t('buttons.liveSite')} ${t('a11y.newTab')}`}
                  >
                    <span>{t('buttons.liveSite')}</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </Button>
                ) : null}
                {project.repoUrl ? (
                  <Button
                    href={project.repoUrl}
                    variant="secondary"
                    aria-label={`GitHub ${t('a11y.newTab')}`}
                  >
                    <Github size={15} aria-hidden="true" />
                    <span>GitHub</span>
                  </Button>
                ) : (
                  <p className="text-sm text-muted">{tp('labels.repoMissing')}</p>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 aspect-[16/10] w-full overflow-hidden rounded-xl border border-border">
              <ProjectImage
                project={project}
                title={item.title}
                className="h-full w-full"
              />
            </div>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div className="space-y-10">
              <Reveal>
                <Block title={tp('labels.overview')}>
                  <p className="leading-relaxed text-muted">{item.overview}</p>
                </Block>
              </Reveal>
              <Reveal delay={0.05}>
                <Block title={tp('labels.problem')}>
                  <p className="leading-relaxed text-muted">{item.problem}</p>
                </Block>
              </Reveal>
              <Reveal delay={0.1}>
                <Block title={tp('labels.myRole')}>
                  <p className="leading-relaxed text-muted">{item.role}</p>
                </Block>
              </Reveal>
            </div>

            <div className="space-y-10">
              <Reveal delay={0.05}>
                <Block title={tp('labels.whatIBuilt')}>
                  <ul className="space-y-3">
                    {item.built.map((point, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          aria-hidden="true"
                        />
                        <p className="leading-relaxed text-muted">{point}</p>
                      </li>
                    ))}
                  </ul>
                </Block>
              </Reveal>
              <Reveal delay={0.1}>
                <Block title={tp('labels.whatILearned')}>
                  <p className="leading-relaxed text-muted">{item.learned}</p>
                </Block>
              </Reveal>
              {item.demoDataNote ? (
                <Reveal delay={0.12}>
                  <p
                    role="note"
                    className="rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm leading-relaxed text-muted"
                  >
                    {item.demoDataNote}
                  </p>
                </Reveal>
              ) : null}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12">
              <h3 className="font-mono text-sm text-accent">
                {tp('labels.screenshots')}
              </h3>
              <p className="mt-3 text-sm text-muted">
                {item.screenshotsNote}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="aspect-[16/10] overflow-hidden rounded-xl border border-border"
                  >
                    <ProjectImage
                      project={screenshotSlot(project, n)}
                      title={`${item.title} ${n}`}
                      className="h-full w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <nav
              aria-label={t('buttons.previousProject')}
              className="mt-14 grid gap-4 sm:grid-cols-2"
            >
              <Link
                to={`/projects/${prev.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-5 transition-colors duration-150 hover:border-accent"
              >
                <ArrowLeft
                  size={16}
                  className="shrink-0 text-muted transition-colors duration-150 group-hover:text-accent"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-mono text-xs text-muted">
                    {t('buttons.previousProject')}
                  </p>
                  <p className="mt-0.5 font-display font-semibold">
                    {tp(`items.${prev.key}.title`)}
                  </p>
                </div>
              </Link>
              <Link
                to={`/projects/${next.slug}`}
                className="group flex items-center justify-end gap-3 rounded-xl border border-border bg-surface p-5 text-right transition-colors duration-150 hover:border-accent"
              >
                <div>
                  <p className="font-mono text-xs text-muted">
                    {t('buttons.nextProject')}
                  </p>
                  <p className="mt-0.5 font-display font-semibold">
                    {tp(`items.${next.key}.title`)}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-muted transition-colors duration-150 group-hover:text-accent"
                  aria-hidden="true"
                />
              </Link>
            </nav>
          </Reveal>
        </div>
      </section>
    </>
  );
}
