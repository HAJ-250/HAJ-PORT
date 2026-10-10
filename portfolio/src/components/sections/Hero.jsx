import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { site } from '@/data/site.js';
import { Avatar } from '@/components/ui/Avatar.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { HAJWordmark } from '@/components/ui/HAJWordmark.jsx';
import { HAJWordmarkCanvas } from '@/components/ui/HAJWordmarkCanvas.jsx';

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
function TerminalCard({ className = '' }) {
  const { t } = useTranslation('home');
  return (
    <div className={`corner-accent w-full max-w-md rounded-xl border border-border bg-surface/90 p-4 shadow-lg shadow-black/5 ${className}`}>
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
    <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pt-40 lg:pt-48">
      <div className="absolute inset-0 -z-10 hero-grid opacity-50" aria-hidden="true" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left side: Content */}
          <div className="relative z-10">
            <Reveal>
              <p className="font-mono text-sm text-accent tracking-wider uppercase">{t('hero.label')}</p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05]">
                {t('hero.name')}
              </h1>
              <p className="mt-2 font-mono text-sm text-muted">{t('hero.aka')}</p>
              <p className="mt-6 font-display text-xl text-accent sm:text-2xl lg:text-3xl font-medium">
                {t('hero.role')}
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted lg:text-lg">
                {t('hero.positioning')}
              </p>
              <p className="mt-3 text-sm text-muted">{t('hero.note')}</p>

              {/* Tech badges */}
              <div className="mt-8 flex flex-wrap gap-2" role="list" aria-label="Technology stack">
                {['React', 'JavaScript', 'Node.js', 'PHP', 'MySQL', 'HTML', 'CSS', 'Tailwind'].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 font-mono text-xs text-violet-300 transition-all duration-200 hover:border-violet-500 hover:bg-violet-500/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    role="listitem"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="#projects" size="lg">
                  {tc('buttons.viewProjects')}
                  <ArrowDown size={16} aria-hidden="true" />
                </Button>
                <Button variant="secondary" href="#contact" size="lg">
                  {tc('buttons.contactMe')}
                </Button>
                <Button
                  variant="secondary"
                  disabled={!site.cv.available}
                  href={site.cv.available ? site.cv.path : undefined}
                  aria-label={site.cv.available ? tc('buttons.downloadCv') : tc('buttons.cvComingSoon')}
                  size="lg"
                >
                  {site.cv.available ? tc('buttons.downloadCv') : tc('buttons.cvComingSoon')}
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <TerminalCard />
            </Reveal>
          </div>

          {/* Right side: Portrait with HAJ wordmark */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* HAJ Wordmark Canvas Background */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none lg:-z-0">
                <HAJWordmarkCanvas width={500} height={500} className="opacity-60" />
              </div>

              {/* Large HAJ Wordmark with upward animation */}
              <Reveal delay={0.05} y={0}>
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none lg:-z-0">
                  <HAJWordmark size="hero" animate={true} stagger={0.1} />
                </div>
              </Reveal>

              {/* Portrait with premium frame */}
              <Reveal delay={0.1} className="relative z-10 group">
                <Avatar size="hero" />
                <div className="absolute inset-0 rounded-[2.7rem] border border-violet-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
              </Reveal>

              {/* Floating tech labels */}
              <Reveal delay={0.15} className="relative z-10">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden lg:block">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 font-mono text-xs text-violet-300 animate-float-slow">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-75" />
                      <span className="relative rounded-full bg-violet-500" />
                    </span>
                    Full-Stack
                  </span>
                </div>
                <div className="absolute top-1/2 -right-10 hidden lg:block">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 font-mono text-xs text-violet-300 animate-float" style={{ animationDelay: '0.5s' }}>
                    React / Node
                  </span>
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 font-mono text-xs text-violet-300 animate-float-slow" style={{ animationDelay: '1s' }}>
                    PHP / MySQL
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <Reveal delay={0.25}>
          <a
            href="#about"
            className="mt-16 flex items-center justify-center gap-2 font-mono text-xs text-muted transition-colors duration-150 hover:text-accent"
            aria-label={t('hero.scrollHint')}
          >
            <span>{t('hero.scrollHint')}</span>
            <ArrowDown size={14} aria-hidden="true" className="animate-bounce-subtle" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}