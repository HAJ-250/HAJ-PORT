import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPublishedPosts } from '@/lib/blog-data.js';
import { Seo } from '@/lib/seo.jsx';
import { Card } from '@/components/ui/Card.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { SectionHeading } from '@/components/ui/SectionHeading.jsx';

export function BlogIndex() {
  const { t: tb } = useTranslation('blog');
  const posts = getPublishedPosts();

  return (
    <>
      <Seo
        title={tb('index.title')}
        description={tb('index.lead')}
        path="blog"
      />
      <section className="pb-24 pt-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              index="08"
              titleId="blog-index-title"
              title={tb('index.title')}
              lead={tb('index.lead')}
            />
          </Reveal>

          {posts.length === 0 ? (
            <Reveal delay={0.05}>
              <p className="mt-10 text-muted">{tb('index.empty')}</p>
            </Reveal>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {posts.map((post, index) => (
                <Reveal key={post.slug} delay={index * 0.06}>
                  <Card hover className="h-full p-6">
                    <p className="font-mono text-xs text-muted">{post.date}</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="transition-colors duration-150 hover:text-accent"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.summary ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {post.summary}
                      </p>
                    ) : null}
                    {Array.isArray(post.tags) && post.tags.length > 0 ? (
                      <p className="mt-4 font-mono text-xs text-muted">
                        {post.tags.join(' · ')}
                      </p>
                    ) : null}
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
