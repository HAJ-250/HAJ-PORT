import { Facebook, Github, Instagram, Mail, ArrowUp, Phone, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { site } from '@/data/site.js';
import { Monogram } from '@/components/ui/Monogram.jsx';
import { HAJWordmark } from '@/components/ui/HAJWordmark.jsx';
import { HAJWordmarkCanvas } from '@/components/ui/HAJWordmarkCanvas.jsx';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const sectionLinks = [
    { id: 'about', label: t('nav.about') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'journey', label: t('nav.journey') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const socials = [
    { href: site.phone.telLocal, label: site.phone.display, icon: Phone, isTel: true },
    { href: site.emailUrl, label: 'Email', icon: Mail },
    { href: site.whatsapp.url, label: 'WhatsApp', icon: MessageCircle },
    { href: site.facebook, label: 'Facebook', icon: Facebook },
    { href: site.instagram, label: 'Instagram', icon: Instagram },
  ];

  if (site.github.username) {
    socials.push({ href: site.github.profileUrl, label: 'GitHub', icon: Github });
  }

  return (
    <footer className="relative border-t border-border bg-surface overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-20">
          <HAJWordmarkCanvas width={600} height={600} />
        </div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-10">
          <HAJWordmarkCanvas width={400} height={400} />
        </div>
        <div className="absolute top-0 left-0 w-[300px] h-[300px] opacity-10">
          <HAJWordmarkCanvas width={300} height={300} />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2 relative">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <Monogram size={44} />
                <div className="absolute -inset-2 rounded-xl border border-violet-500/20 animate-pulse-glow" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-xl font-semibold tracking-tight text-text">
                  {site.name}
                </p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {t('hero.aka')} · {site.title}
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              {t('footer.tagline')}
            </p>
            <p className="mt-4 flex items-center gap-1.5 font-mono text-xs text-muted">
              <span aria-hidden="true">📍</span>
              {site.location}
            </p>

            {/* HAJ Wordmark decorative */}
            <div className="absolute bottom-0 right-0 w-full max-w-md h-full opacity-15 pointer-events-none" aria-hidden="true">
              <HAJWordmark size="footer" animate={true} drift={true} stagger={0.2} fontWeight={700} className="absolute bottom-4 right-4" />
            </div>
          </div>

          <nav aria-label={t('footer.sections')}>
            <p className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
              {t('footer.sections')}
            </p>
            <ul className="space-y-3">
              {sectionLinks.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex items-center gap-2 text-sm text-muted transition-all duration-200 hover:text-accent hover:translate-x-1"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('footer.connect')}>
            <p className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
              {t('footer.connect')}
            </p>
            <ul className="space-y-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-3 text-sm text-muted transition-all duration-200 hover:text-accent hover:translate-x-1"
                    aria-label={`${label}${href.startsWith('http') ? ` ${t('a11y.newTab')}` : ''}`}
                  >
                    {Icon ? <Icon size={16} aria-hidden="true" /> : (
                      <MessageCircle size={16} aria-hidden="true" className="text-violet-500" />
                    )}
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">
            © {year} {site.name}. {t('footer.rights')}
          </p>
          <p className="font-mono text-xs text-muted hidden sm:block">
            {site.location} · {site.email} · {site.phone.display}
          </p>
          <a
            href="#top"
            className="flex items-center gap-1.5 rounded-full border border-border bg-elevated/50 px-4 py-2 text-xs font-mono text-muted transition-all duration-200 hover:border-violet-500/50 hover:text-violet-400 hover:bg-violet-500/10"
            aria-label="Back to top"
          >
            <ArrowUp size={12} aria-hidden="true" />
            <span>Top</span>
          </a>
        </div>
      </div>
    </footer>
  );
}