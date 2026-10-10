import { useTranslation } from 'react-i18next';
import { site } from '@/data/site.js';
import { useGithubRepos } from '@/hooks/useGithubRepos.js';
import { Button } from '@/components/ui/Button.jsx';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';
import { Tag } from '@/components/ui/Tag.jsx';

function RepoCard({ repo, note }) {
  const language = repo?.language;
  const stars = typeof repo?.stargazers_count === 'number' ? repo.stargazers_count : null;

  return (
    <Card hover className="flex h-full flex-col p-5">
      <div className="flex items-center justify-between gap-3">
        <a
          href={repo?.html_url || `https://github.com/${site.github.username}/${repo?.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-lg font-semibold tracking-tight text-accent hover:underline"
        >
          {repo?.name}
        </a>
        {stars !== null ? (
          <span className="font-mono text-xs text-muted">
            ★ {stars}
          </span>
        ) : null}
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {note || repo?.description || ''}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {language ? <Tag>{language}</Tag> : null}
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
      className="border-y border-border bg-surface/40"
    >
      <Reveal>
        <SectionHeading
          index="04"
          titleId="github-title"
          title={th('github.title')}
          lead={th('github.lead')}
        />
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-muted">
          {th('github.handpicked')}
        </p>
      </Reveal>
      <div className="mt-4 grid gap-5 md:grid-cols-2">
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
            aria-label={`${t('buttons.openProfile')} (${t('a11y.newTab')})`}
          >
            <span>{t('buttons.openProfile')}</span>
          </Button>
        </div>
      </Reveal>

      {status === 'loading' && (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-border bg-elevated/60"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {status === 'error' && (
        <Reveal delay={0.05}>
          <p className="mt-4 rounded-xl border border-border bg-elevated/60 p-4 text-sm text-muted" role="status">
            {th('github.error')}
          </p>
        </Reveal>
      )}

      {status === 'success' && autoRepos.length > 0 && (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {autoRepos.map((repo) => (
            <Reveal key={repo.id} delay={0.04}>
              <RepoCard repo={repo} note="" />
            </Reveal>
          ))}
        </div>
      )}

      {status === 'success' && autoRepos.length === 0 && (
        <p className="mt-4 text-sm text-muted" role="status">
          {th('github.empty')}
        </p>
      )}
    </Section>
  );
}
