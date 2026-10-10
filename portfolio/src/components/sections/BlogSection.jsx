import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getPublishedPosts } from '@/lib/blog-data.js';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';
import { Tag } from '@/components/ui/Tag.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { HAJWordmarkCanvas } from '@/components/ui/HAJWordmarkCanvas.jsx';

export function BlogSection() {
  const { t } = useTranslation('home');
  const { t: tb } = useTranslation('blog');
  const posts = getPublishedPosts();

  // Only render when at least one non-draft post exists.
  if (posts.length === 0) return null;

  return (
    <Section id="blog" labelledBy="blog-title" className="relative">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[200px] h-[200px] opacity-5">
          <HAJWordmarkCanvas width={200} height={200} />
        </div>
      </div>

      <Reveal>
        <SectionHeading
          index="08"
          titleId="blog-title"
          title={t('blog.title')}
          lead={t('blog.lead')}
          align="center"
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.08}>
            <Card hover className="flex h-full flex-col p-6 relative overflow-hidden border-border/50 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] group transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              <div className="relative flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <Tag tone="default" className="border-muted/30 bg-muted/10 text-muted text-xs">
                    {post.date}
                  </Tag>
                  {post.tags && post.tags.length > 0 && (
                    <Tag tone="accent" className="border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs">
                      {post.tags[0]}
                    </Tag>
                  )}
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-text group-hover:text-violet-300 transition-colors duration-300 mb-2">
                  <Link to={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                {post.summary ? (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {post.summary}
                  </p>
                ) : null}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors duration-200 group"
                  >
                    {tb('index.readMore')}
                    <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      {posts.length > 3 && (
        <Reveal delay={0.15}>
          <div className="mt-10 text-center">
            <Button
              to="/blog"
              variant="secondary"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t('buttons.viewAllPosts')}
                <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      )}
    </Section>
  );
}