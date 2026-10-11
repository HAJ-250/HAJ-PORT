import { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Facebook,
  Github,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Send,
  MessageSquare,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { site } from '@/data/site.js';
import { validateContact } from '@/lib/validators.js';
import { Button } from '@/components/ui/Button.jsx';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';
import { HAJWordmarkCanvas } from '@/components/ui/HAJWordmarkCanvas.jsx';

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
    { href: site.phone.telLocal, label: site.phone.display, icon: Phone, isTel: true },
    { href: site.emailUrl, label: 'Email', icon: Mail },
    { href: site.whatsapp.url, label: 'WhatsApp', icon: MessageSquare },
    { href: site.facebook, label: 'Facebook', icon: Facebook },
    { href: site.instagram, label: 'Instagram', icon: Instagram },
  ];
  if (site.github.username) {
    socials.push({ href: site.github.profileUrl, label: 'GitHub', icon: Github });
  }

  const renderField = ({ name, label, type = 'text', placeholder, textarea = false, describedBy }) => (
    <div>
      <label htmlFor={FIELD_IDS[name]} className="mb-1.5 block text-sm font-medium text-text">
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
          aria-describedby={errors[name] ? ERROR_IDS[name] : describedBy}
          className={`w-full rounded-xl border bg-surface/50 px-4 py-3 text-sm leading-relaxed text-text placeholder:text-muted/50 transition-all duration-200 focus:outline-none resize-none ${
            errors[name] ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-border/50 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20'
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
          className={`w-full rounded-xl border bg-surface/50 px-4 py-3 text-sm text-text placeholder:text-muted/50 transition-all duration-200 focus:outline-none ${
            errors[name] ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-border/50 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20'
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
    <Section id="contact" labelledBy="contact-title" className="relative bg-gradient-to-b from-violet-500/5 via-transparent to-transparent border-y border-border/50">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] opacity-5">
          <HAJWordmarkCanvas width={300} height={300} />
        </div>
        <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] opacity-5">
          <HAJWordmarkCanvas width={200} height={200} />
        </div>
      </div>

      <Reveal>
        <SectionHeading
          index="05"
          titleId="contact-title"
          title={tc('title')}
          lead={tc('lead')}
          align="center"
        />
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Reveal delay={0.05}>
            <Card className="p-6 sm:p-8 relative overflow-hidden border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent" aria-hidden="true" />
              <div className="relative">
                {status === 'success' ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="relative flex items-start gap-4 rounded-xl border border-violet-500/30 bg-violet-500/10 p-6 animate-in fade-in slide-in-from-y-4 duration-300"
                  >
                    <div className="relative flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={24} className="text-violet-500" aria-hidden="true" />
                      <div className="absolute -inset-1 rounded-full border border-violet-500/30 animate-pulse-glow" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-text">{tc('successTitle')}</p>
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
                        className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 animate-in fade-in slide-in-from-y-2 duration-200"
                      >
                        <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
                        <div>
                          <p className="font-medium text-red-500">{tc('errorTitle')}</p>
                          <p className="mt-1 text-sm text-muted">{tc('errorText')}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Button type="submit" disabled={status === 'sending'} size="lg" className="group relative overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                          <Send size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
                          <span>{status === 'sending' ? tc('sending') : tc('submit')}</span>
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-violet-600 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="secondary"
                        href={site.phone.telLocal}
                        size="lg"
                        className="group relative overflow-hidden flex items-center gap-2"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Phone size={16} aria-hidden="true" />
                          <span>{tc('buttons.callMe')}</span>
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                      </Button>
                    </div>
                  </form>
                )}

                {showFallback && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="mt-6 rounded-xl border border-border bg-surface/50 p-6 animate-in fade-in slide-in-from-y-4 duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                        <Mail size={20} className="text-violet-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-text">{tc('fallbackTitle')}</p>
                        <p className="text-sm text-muted">{tc('fallbackText')}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button href={site.emailUrl} variant="secondary" size="lg" className="flex items-center gap-2">
                        <Mail size={16} aria-hidden="true" />
                        <span>{t('buttons.sendByEmail')}</span>
                      </Button>
                      <Button href={site.whatsapp.url} variant="secondary" size="lg" className="flex items-center gap-2">
                        <MessageSquare size={16} aria-hidden="true" />
                        <span>{t('buttons.whatsappUs')}</span>
                      </Button>
                      <Button href={site.phone.telLocal} variant="secondary" size="lg" className="flex items-center gap-2">
                        <Phone size={16} aria-hidden="true" />
                        <span>{t('buttons.callMe')}</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal delay={0.1}>
            <Card className="p-6 relative overflow-hidden border-border/50 hover:border-violet-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent" aria-hidden="true" />
              <div className="relative flex items-center gap-2 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse-glow" aria-hidden="true" />
                <p className="font-mono text-xs uppercase tracking-wider text-violet-400">
                  {tc('directLabel')}
                </p>
              </div>
<ul className="space-y-3">
                {socials.map(({ href, label, icon: Icon, isTel }) => {
                  const visible =
                    label === 'WhatsApp'
                      ? site.whatsapp.display
                      : label === 'Email'
                      ? site.email
                      : label;
                  const isPhone = isTel || label === 'Phone' || label === site.phone?.display;
                  return (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="relative flex min-h-[48px] items-center gap-3 text-sm text-muted transition-all duration-200 hover:text-violet-400 hover:translate-x-1 group"
                        aria-label={`${visible}${href.startsWith('http') ? ` ${t('a11y.newTab')}` : ''}`}
                      >
                        {Icon ? (
                          <Icon size={18} className="text-muted group-hover:text-violet-400 transition-colors duration-200" aria-hidden="true" />
                        ) : (
                          <MessageCircle size={18} className="text-violet-500" aria-hidden="true" />
                        )}
                        <span className="font-medium">{visible}</span>
                        {isPhone && (
                          <motion.span
                            initial={false}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 text-violet-500"
                            aria-hidden="true"
                          >
                            <ChevronRight size={14} />
                          </motion.span>
                        )}
                        <span className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </Reveal>

          <Reveal delay={0.15}>
            <Card className="p-6 relative overflow-hidden border-border/50 hover:border-violet-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent" aria-hidden="true" />
              <div className="relative flex items-center gap-2 mb-3">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse-glow" aria-hidden="true" />
                <p className="font-mono text-xs uppercase tracking-wider text-violet-400">
                  {t('cv.title')}
                </p>
              </div>
              <p className="relative mb-4 text-sm leading-relaxed text-muted">
                {t('cv.description')}
              </p>
              <Button
                variant="secondary"
                disabled={!site.cv.available}
                href={site.cv.available ? site.cv.path : undefined}
                className="w-full group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {site.cv.available ? t('cv.download') : t('cv.comingSoon')}
                  {site.cv.available && <Send size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              </Button>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}