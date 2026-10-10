/** Standard section heading: monospace index label + title + optional lead. */
export function SectionHeading({ index, title, lead, titleId, align = 'left' }) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start';
  return (
    <div className={`flex flex-col gap-3 ${alignCls}`}>
      <p className="font-mono text-sm text-accent" aria-hidden="true">
        {`// ${index}`}
      </p>
      <h2
        id={titleId}
        className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        {title}
      </h2>
      {lead ? <p className="max-w-2xl text-base text-muted">{lead}</p> : null}
    </div>
  );
}
