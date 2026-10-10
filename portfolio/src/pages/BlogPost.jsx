import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getPostBySlug } from '@/lib/blog-data.js';
import { Markdown } from '@/lib/blog.jsx';
import { Seo } from '@/lib/seo.jsx';
import { Reveal } from '@/components/ui/Reveal.jsx';
import { NotFound } from '@/pages/NotFound.jsx';

export function BlogPost() {
  const { slug } = useParams();
  const { t: tb } = useTranslation('blog');
  const { i18n } = useTranslation();
  const post = getPostBySlug(slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <>
      <Seo
        title={post.title}
        description={post.summary || ''}
        path={`blog/${post.slug}`}
      />
      <article className="pb-24 pt-32">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <Reveal>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-150 hover:text-accent"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              {tb('post.back')}
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-8 font-mono text-sm text-muted">
              {tb('post.on')} {post.date}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            {post.summary ? (
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {post.summary}
              </p>
            ) : null}
            {Array.isArray(post.tags) && post.tags.length > 0 ? (
              <p className="mt-4 font-mono text-xs text-muted">
                <span className="mr-2">{tb('post.tags')}:</span>
                {post.tags.join(' · ')}
              </p>
            ) : null}
            {i18n.language !== 'en' && (
              <p className="mt-4 rounded-xl border border-border bg-elevated/60 p-3 text-sm text-muted">
                {tb('post.availableIn')}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="markdown-body mt-10">
              <Markdown source={post.content} />
            </div>
          </Reveal>
        </div>
      </article>
    </>
  );
}
