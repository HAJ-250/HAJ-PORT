import { useTranslation } from 'react-i18next';
import { testimonials } from '@/data/testimonials.js';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';

export function Testimonials() {
  const { t } = useTranslation('home');

  // Never fabricate quotes: the section only renders with real entries.
  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return null;
  }

  return (
    <Section labelledBy="testimonials-title">
      <Reveal>
        <SectionHeading
          index="07"
          titleId="testimonials-title"
          title={t('testimonials.title')}
          lead={t('testimonials.lead')}
        />
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <Reveal key={index} delay={index * 0.06}>
            <Card className="h-full p-6">
              <p className="leading-relaxed text-muted">“{item.quote}”</p>
              <p className="mt-4 font-medium">{item.author}</p>
              {item.role ? (
                <p className="mt-0.5 text-sm text-muted">{item.role}</p>
              ) : null}
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
