import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { site } from '@/data/site.js';
import { Avatar } from '@/components/ui/Avatar.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';

const TERMINAL_ROWS = [
  [{ text: 'const haj = {', tone: 'kw' }],
  [
    { text: '  name: ', tone: 'key' },
    { text: '"HIRWA Aime JOSPIN"', tone: 'str' },
    { text: ',', tone: 'punct' },
  ],
  [
    { text: '  aka: ', tone: 'key' },
    { text: '"MC HAJ"', tone: 'str' },
    { text: ',', tone: 'punct' },
  ],
  [
    { text: '  role: ', tone: 'key' },
    { text: '"Full-Stack Developer"', tone: 'str' },
    { text: ',', tone: 'punct' },
  ],
  [
    { text: '  based: ', tone: 'key' },
    { text: '"Rusizi, Rwanda"', tone: 'str' },
    { text: ',', tone: 'punct' },
  ],
  [
    { text: '  strengths: ', tone: 'key' },
    { text: '["problem solving", "creativity", "innovation"]', tone: 'str' },
    { text: ',', tone: 'punct' },
  ],
  [
    { text: '  workStyle: ', tone: 'key' },
    { text: '["independent", "in a team"]', tone: 'str' },
    { text: ',', tone: 'punct' },
  ],
  [
    { text: '  focus: ', tone: 'key' },
    { text: '["creative software products", "multimedia"]', tone: 'str' },
    { text: ',', tone: 'punct' },
  ],
  [
    { text: '  openTo: ', tone: 'key' },
    { text: '["job", "internship", "freelance", "collaboration"]', tone: 'str' },
  ],
  [{ text: '};', tone: 'punct' }],
];

const TONE_CLASSES = {
  kw: 'text-accent-2',
  key: 'text-accent',
  str: 'text-text',
  punct: 'text-muted',
};

/** Static, terminal-style card describing the owner — built only from verified facts. */
function TerminalCard() {
  const { t } = useTranslation('home');
  return (
    <div className="corner-accent w-full max-w-md rounded-xl border border-border bg-surface/90 p-4 shadow-lg shadow-black/5">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-muted">{t('hero.terminalTitle')}</span>
      </div>
      <pre className="overflow-x-auto font-mono text-xs leading-relaxed sm:text-sm">
        <code>
          {TERMINAL_ROWS.map((parts, i) => (
            <span key={i} className="block whitespace-pre">
              {parts.map((part, j) => (
                <span key={j} className={TONE_CLASSES[part.tone]}>
                  {part.text}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

export function Hero() {
  const { t } = useTranslation('home');
  const { t: tc } = useTranslation('common');

  return (
    <section id="top" className="hero-grid relative overflow-hidden pb-20 pt-36 sm:pt-44">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="font-mono text-sm text-accent">{t('hero.label')}</p>
              <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {t('hero.name')}
              </h1>
              <p className="mt-1 font-mono text-sm text-muted">{t('hero.aka')}</p>
              <p className="mt-4 font-display text-xl text-accent sm:text-2xl">
                {t('hero.role')}
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                {t('hero.positioning')}
              </p>
              <p className="mt-2 text-sm text-muted">{t('hero.note')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#projects">
                  {tc('buttons.viewProjects')}
                </Button>
                <Button variant="secondary" href="#contact">
                  {tc('buttons.contactMe')}
                </Button>
                <Button
                  variant="secondary"
                  disabled={!site.cv.available}
                  href={site.cv.available ? site.cv.path : undefined}
                  aria-label={
                    site.cv.available ? tc('buttons.downloadCv') : tc('buttons.cvComingSoon')
                  }
                >
                  {site.cv.available ? tc('buttons.downloadCv') : tc('buttons.cvComingSoon')}
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col items-center gap-8">
            <Reveal delay={0.08}>
              <Avatar className="h-52 w-52 sm:h-60 sm:w-60" />
            </Reveal>
            <Reveal delay={0.16}>
              <TerminalCard />
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2}>
          <a
            href="#about"
            className="mt-16 flex items-center justify-center gap-2 font-mono text-xs text-muted transition-colors duration-150 hover:text-accent"
            aria-label={t('hero.scrollHint')}
          >
            <span>{t('hero.scrollHint')}</span>
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
