import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getPublishedPosts } from '@/lib/blog-data.js';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { Section } from '@/components/ui/Section.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';

export function BlogSection() {
  const { t } = useTranslation('home');
  const { t: tb } = useTranslation('blog');
  const posts = getPublishedPosts();

  // Only render when at least one non-draft post exists.
  if (posts.length === 0) return null;

  return (
    <Section labelledBy="blog-title">
      <Reveal>
        <SectionHeading
          index="08"
          titleId="blog-title"
          title={t('blog.title')}
          lead={t('blog.lead')}
        />
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {posts.slice(0, 4).map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.06}>
            <Card hover className="flex h-full flex-col p-6">
              <p className="font-mono text-xs text-muted">{post.date}</p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
                <Link
                  to={`/blog/${post.slug}`}
                  className="transition-colors duration-150 hover:text-accent"
                >
                  {post.title}
                </Link>
              </h3>
              {post.summary ? (
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {post.summary}
                </p>
              ) : null}
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent">
                {tb('index.readMore')}
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
