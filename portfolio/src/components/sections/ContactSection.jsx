import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Facebook,
  Github,
  Instagram,
  Mail,
  Send,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { site } from '@/data/site.js';
import { validateContact } from '@/lib/validators.js';
import { Button } from '@/components/ui/Button.jsx';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';

const INITIAL_VALUES = { name: '', email: '', subject: '', message: '', company: '' };

const FIELD_IDS = {
  name: 'contact-name',
  email: 'contact-email',
  subject: 'contact-subject',
  message: 'contact-message',
};

const ERROR_IDS = {
  name: 'contact-error-name',
  email: 'contact-error-email',
  subject: 'contact-error-subject',
  message: 'contact-error-message',
};

export function ContactSection() {
  const { t } = useTranslation('common');
  const { t: tc } = useTranslation('contact');

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [errorCode, setErrorCode] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateContact(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('idle');
      const firstField = Object.keys(validationErrors)[0];
      document.getElementById(FIELD_IDS[firstField])?.focus();
      return;
    }

    setErrors({});
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('success');
        setValues(INITIAL_VALUES);
      } else {
        setStatus('error');
        setErrorCode(data.error || 'unexpected');
      }
    } catch {
      setStatus('error');
      setErrorCode('network');
    }
  };

  const showFallback = status === 'error' && errorCode === 'not_configured';

  const socials = [
    { href: site.emailUrl, label: 'Email', icon: Mail },
    { href: site.whatsapp.url, label: 'WhatsApp', icon: null },
    { href: site.facebook, label: 'Facebook', icon: Facebook },
    { href: site.instagram, label: 'Instagram', icon: Instagram },
  ];
  if (site.github.username) {
    socials.push({ href: site.github.profileUrl, label: 'GitHub', icon: Github });
  }

  const renderField = ({ name, label, type = 'text', placeholder, textarea = false, describedBy }) => (
    <div>
      <label htmlFor={FIELD_IDS[name]} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={FIELD_IDS[name]}
          name={name}
          rows={6}
          value={values[name]}
          onChange={handleChange}
          placeholder={placeholder}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={
            errors[name] ? ERROR_IDS[name] : describedBy
          }
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm leading-relaxed text-text placeholder:text-muted/70 transition-colors duration-150 focus:outline-none ${
            errors[name] ? 'border-red-500' : 'border-border focus:border-accent'
          }`}
        />
      ) : (
        <input
          id={FIELD_IDS[name]}
          name={name}
          type={type}
          value={values[name]}
          onChange={handleChange}
          placeholder={placeholder}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? ERROR_IDS[name] : describedBy}
          autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : undefined}
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/70 transition-colors duration-150 focus:outline-none ${
            errors[name] ? 'border-red-500' : 'border-border focus:border-accent'
          }`}
        />
      )}
      {errors[name] ? (
        <p id={ERROR_IDS[name]} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          {tc(`errors.${name}`)}
        </p>
      ) : null}
    </div>
  );

  return (
    <Section id="contact" labelledBy="contact-title" className="bg-surface/40">
      <Reveal>
        <SectionHeading
          index="09"
          titleId="contact-title"
          title={tc('title')}
          lead={tc('lead')}
        />
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Reveal delay={0.05}>
            <Card className="p-6 sm:p-8">
              {status === 'success' ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 p-5"
                >
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-medium">{tc('successTitle')}</p>
                    <p className="mt-1 text-sm text-muted">{tc('successText')}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {renderField({
                      name: 'name',
                      label: tc('nameLabel'),
                      placeholder: tc('namePlaceholder'),
                    })}
                    {renderField({
                      name: 'email',
                      label: tc('emailLabel'),
                      type: 'email',
                      placeholder: tc('emailPlaceholder'),
                    })}
                  </div>
                  <div className="mt-5">
                    {renderField({
                      name: 'subject',
                      label: tc('subjectLabel'),
                      placeholder: tc('subjectPlaceholder'),
                    })}
                  </div>
                  <div className="mt-5">
                    {renderField({
                      name: 'message',
                      label: tc('messageLabel'),
                      placeholder: tc('messagePlaceholder'),
                      textarea: true,
                    })}
                  </div>

                  {/* Honeypot: humans never see it, bots fill it, the server rejects silently */}
                  <input
                    type="text"
                    name="company"
                    value={values.company}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="sr-only"
                  />

                  {status === 'error' && !showFallback && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
                    >
                      <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
                      <div>
                        <p className="font-medium text-red-500">{tc('errorTitle')}</p>
                        <p className="mt-1 text-sm text-muted">{tc('errorText')}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Button type="submit" disabled={status === 'sending'}>
                      <Send size={15} aria-hidden="true" />
                      <span>{status === 'sending' ? tc('sending') : tc('submit')}</span>
                    </Button>
                  </div>
                </form>
              )}

              {showFallback && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mt-6 rounded-xl border border-border bg-elevated/60 p-5"
                >
                  <p className="font-medium">{tc('fallbackTitle')}</p>
                  <p className="mt-1 text-sm text-muted">{tc('fallbackText')}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button href={site.emailUrl} variant="secondary">
                      <Mail size={15} aria-hidden="true" />
                      <span>{t('buttons.sendByEmail')}</span>
                    </Button>
                    <Button href={site.whatsapp.url} variant="secondary">
                      <span>{t('buttons.whatsappUs')}</span>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </Reveal>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Reveal delay={0.1}>
            <Card className="p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">
                {tc('directLabel')}
              </p>
              <ul className="mt-4 space-y-3">
                {socials.map(({ href, label, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex min-h-[44px] items-center gap-3 text-sm text-muted transition-colors duration-150 hover:text-accent"
                      aria-label={`${label}${href.startsWith('http') ? ` (${t('a11y.newTab')})` : ''}`}
                    >
                      {Icon ? <Icon size={16} aria-hidden="true" /> : null}
                      {label === 'WhatsApp' ? site.whatsapp.display : label === 'Email' ? site.email : label}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          <Reveal delay={0.15}>
            <Card className="p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">
                {t('cv.title')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t('cv.description')}
              </p>
              <Button
                variant="secondary"
                disabled={!site.cv.available}
                href={site.cv.available ? site.cv.path : undefined}
                className="mt-4 w-full"
              >
                {site.cv.available ? t('cv.download') : t('cv.comingSoon')}
              </Button>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
