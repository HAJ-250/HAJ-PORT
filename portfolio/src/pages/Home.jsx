import { useTranslation } from 'react-i18next';
import { Seo } from '@/lib/seo.jsx';
import { personJsonLd, websiteJsonLd } from '@/lib/json-ld.js';
import { Hero } from '@/components/sections/Hero.jsx';
import { About } from '@/components/sections/About.jsx';
import { Skills } from '@/components/sections/Skills.jsx';
import { ProjectsSection } from '@/components/sections/ProjectsSection.jsx';
import { GitHubSection } from '@/components/sections/GitHubSection.jsx';
import { Journey } from '@/components/sections/Journey.jsx';
import { Stats } from '@/components/sections/Stats.jsx';
import { Testimonials } from '@/components/sections/Testimonials.jsx';
import { BlogSection } from '@/components/sections/BlogSection.jsx';
import { ContactSection } from '@/components/sections/ContactSection.jsx';

export function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Seo jsonLd={[personJsonLd(), websiteJsonLd(t('meta.tagline'))]} />
      <Hero />
      <About />
      <Skills />
      <ProjectsSection />
      <GitHubSection />
      <Journey />
      <Stats />
      <Testimonials />
      <BlogSection />
      <ContactSection />
    </>
  );
}
