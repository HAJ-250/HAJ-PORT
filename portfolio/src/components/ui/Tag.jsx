const tones = {
  default: 'border-border bg-elevated text-muted',
  accent: 'border-accent/40 bg-accent/10 text-accent',
  highlight: 'border-accent-2/40 bg-accent-2/10 text-accent-2',
};

/** Small pill chip used for tags, tech stacks and status badges. */
export function Tag({ children, tone = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-xs ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
