/** Page section wrapper: semantic landmark, scroll offset for the fixed navbar. */
export function Section({ id, children, labelledBy, className = '', ...rest }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`scroll-mt-28 py-20 sm:py-24 ${className}`}
      {...rest}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
