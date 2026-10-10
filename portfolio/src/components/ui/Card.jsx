/** Base card with optional hover lift and soft inner glow. */
export function Card({ children, hover = false, className = '', ...rest }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface ${
        hover
          ? 'transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
