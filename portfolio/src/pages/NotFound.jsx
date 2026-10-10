import { useTranslation } from 'react-i18next';
import { Seo } from '@/lib/seo.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';

export function NotFound() {
  const { t } = useTranslation('common');

  return (
    <>
      <Seo title={t('notFound.title')} noindex />
      <section className="flex min-h-[60vh] items-center pb-24 pt-32">
        <div className="mx-auto w-full max-w-2xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="font-mono text-sm text-accent" aria-hidden="true">
              404
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t('notFound.title')}
            </h1>
            <p className="mt-4 leading-relaxed text-muted">{t('notFound.lead')}</p>
            <div className="mt-8">
              <Button to="/">{t('notFound.home')}</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
