import { useState } from 'react';

/**
 * Project card media. Tries public/images/projects/<slug>-1.jpg and falls back
 * to a styled panel showing the project name. Never hotlinks remote images.
 */
export function ProjectImage({ project, title, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={title}
        className={`flex flex-col items-center justify-center gap-2 border-b border-border bg-gradient-to-br from-elevated to-surface ${className}`}
      >
        <span className="font-mono text-xs text-muted">{project.slug}</span>
        <span className="px-4 text-center font-display text-2xl font-semibold text-accent">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={project.image}
      alt={`${title} — project screenshot`}
      width={800}
      height={500}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] ${className}`}
    />
  );
}
