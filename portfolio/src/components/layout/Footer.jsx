import { Facebook, Github, Instagram, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { site } from '@/data/site.js';
import { Monogram } from '@/components/ui/Monogram.jsx';

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
    { href: site.emailUrl, label: 'Email', icon: Mail },
    { href: site.whatsapp.url, label: 'WhatsApp', icon: null },
    { href: site.facebook, label: 'Facebook', icon: Facebook },
    { href: site.instagram, label: 'Instagram', icon: Instagram },
  ];

  if (site.github.username) {
    socials.push({ href: site.github.profileUrl, label: 'GitHub', icon: Github });
  }

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Monogram size={36} />
              <div>
                <p className="font-display text-lg font-semibold tracking-tight">
                  {site.name}
                </p>
                <p className="font-mono text-xs text-muted">
                  {t('hero.aka')} · {site.title}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted">
              {t('footer.tagline')}
            </p>
            <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-muted">
              <span aria-hidden="true">📍</span>
              {site.location}
            </p>
          </div>

          <nav aria-label={t('footer.sections')}>
            <p className="font-mono text-xs uppercase tracking-wider text-muted">
              {t('footer.sections')}
            </p>
            <ul className="mt-3 space-y-2">
              {sectionLinks.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-sm text-muted transition-colors duration-150 hover:text-accent"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('footer.connect')}>
            <p className="font-mono text-xs uppercase tracking-wider text-muted">
              {t('footer.connect')}
            </p>
            <ul className="mt-3 space-y-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-accent"
                    aria-label={`${label} ${t('a11y.newTab')}`}
                  >
                    {Icon ? <Icon size={15} aria-hidden="true" /> : null}
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">
            © {year} {site.name}. {t('footer.rights')}
          </p>
          <p className="font-mono text-xs text-muted">
            {site.location} · {site.email}
          </p>
        </div>
      </div>
    </footer>
  );
}
