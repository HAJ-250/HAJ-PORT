import { useTranslation } from 'react-i18next';
import { testimonials } from '@/data/testimonials.js';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';
import { Tag } from '@/components/ui/Tag.jsx';
import { HAJWordmarkCanvas } from '@/components/ui/HAJWordmarkCanvas.jsx';

export function Testimonials() {
  const { t } = useTranslation('home');

  // Never fabricate quotes: the section only renders with real entries.
  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return null;
  }

  return (
    <Section id="testimonials" labelledBy="testimonials-title" className="relative">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[200px] h-[200px] opacity-5">
          <HAJWordmarkCanvas width={200} height={200} />
        </div>
      </div>

      <Reveal>
        <SectionHeading
          index="07"
          titleId="testimonials-title"
          title={t('testimonials.title')}
          lead={t('testimonials.lead')}
          align="center"
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <Reveal key={index} delay={index * 0.08}>
            <Card className="h-full p-6 relative overflow-hidden border-border/50 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] group transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-2xl text-violet-500/30 font-display font-bold" aria-hidden="true">“</span>
                  <Tag tone="highlight" className="border-violet-400/40 bg-violet-400/10 text-violet-300 text-xs">
                    TESTIMONIAL
                  </Tag>
                </div>
                <p className="leading-relaxed text-muted mb-5">“{item.quote}”</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500/30 to-violet-600/30 flex items-center justify-center font-display font-semibold text-text">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-text">{item.author}</p>
                    {item.role ? (
                      <p className="text-sm text-muted">{item.role}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}