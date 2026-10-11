import { useTranslation } from 'react-i18next';
import { site } from '@/data/site.js';
import { useGithubRepos } from '@/hooks/useGithubRepos.js';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button.jsx';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';
import { Tag } from '@/components/ui/Tag.jsx';
import { HAJWordmarkCanvas } from '@/components/ui/HAJWordmarkCanvas.jsx';

function RepoCard({ repo, note }) {
  const language = repo?.language;
  const stars = typeof repo?.stargazers_count === 'number' ? repo.stargazers_count : null;

  return (
    <Card hover className="flex h-full flex-col p-6 relative overflow-hidden border-border/50 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] group transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between gap-3 mb-3">
          <a
            href={repo?.html_url || `https://github.com/${site.github.username}/${repo?.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-lg font-semibold tracking-tight text-text group-hover:text-violet-400 transition-colors duration-200"
          >
            {repo?.name}
          </a>
          {stars !== null ? (
            <span className="flex items-center gap-1 font-mono text-xs text-muted">
              <span className="text-amber-400">★</span>
              {stars}
            </span>
          ) : null}
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {note || repo?.description || ''}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {language ? (
            <Tag className="border-violet-500/30 bg-violet-500/10 text-violet-300 hover:border-violet-500 hover:bg-violet-500/20">
              {language}
            </Tag>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function GitHubSection() {
  const { t } = useTranslation('common');
  const { t: th } = useTranslation('home');
  const { status, repos } = useGithubRepos();

  // Hidden entirely when no username could be verified
  if (!site.github.username || status === 'hidden') return null;

  const handpickedNames = site.github.handpicked;
  const handpicked = handpickedNames.map((name) => ({
    repo: repos.find((r) => r.name === name),
    name,
    note: th(`github.handpickedNotes.${name}`),
  }));

  const autoRepos = repos
    .filter((r) => !handpickedNames.includes(r.name))
    .filter((r) => !site.github.exclude.includes(r.name))
    .filter((r) => r.description && r.description.trim().length > 0)
    .slice(0, site.github.maxAutoRepos);

  return (
    <Section
      id="github"
      labelledBy="github-title"
      className="relative border-y border-border/50 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] opacity-5">
          <HAJWordmarkCanvas width={300} height={300} />
        </div>
      </div>

      <Reveal>
        <SectionHeading
          index="04"
          titleId="github-title"
          title={th('github.title')}
          lead={th('github.lead')}
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            {th('github.handpicked')}
          </p>
          <Tag tone="highlight" className="border-violet-400/40 bg-violet-400/10 text-violet-300">
            FEATURED
          </Tag>
        </div>
      </Reveal>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {handpicked.map(({ repo, name, note }) => (
          <Reveal key={name} delay={0.05}>
            <RepoCard repo={repo || { name }} note={note} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            {th('github.more')}
          </p>
          <Button
            href={site.github.profileUrl}
            variant="ghost"
            aria-label={`${t('buttons.openProfile')} ${t('a11y.newTab')}`}
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              {t('buttons.openProfile')}
              <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </Reveal>

      {status === 'loading' && (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl border border-border/50 bg-elevated/60"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {status === 'error' && (
        <Reveal delay={0.05}>
          <Card className="p-6 border-border/50">
            <p className="text-sm text-muted" role="status">
              {th('github.error')}
            </p>
          </Card>
        </Reveal>
      )}

      {status === 'success' && autoRepos.length > 0 && (
        <Reveal delay={0.1}>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {autoRepos.map((repo) => (
              <Reveal key={repo.id} delay={0.04}>
                <RepoCard repo={repo} note="" />
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}

      {status === 'success' && autoRepos.length === 0 && (
        <Reveal delay={0.1}>
          <Card className="p-6 border-border/50">
            <p className="text-sm text-muted" role="status">
              {th('github.empty')}
            </p>
          </Card>
        </Reveal>
      )}
    </Section>
  );
}