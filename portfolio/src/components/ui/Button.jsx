import { Link } from 'react-router-dom';

const baseClasses =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ease-out';

const variants = {
  primary: 'bg-accent text-on-accent hover:opacity-90',
  secondary: 'border border-border bg-elevated text-text hover:border-accent',
  ghost: 'text-muted hover:text-text',
};

/**
 * Accessible button that renders as <a>, <Link> or <button>.
 * When `disabled`, renders a non-interactive span with aria-disabled.
 */
export function Button({
  to,
  href,
  onClick,
  variant = 'primary',
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...rest
}) {
  const classes = `${baseClasses} ${variants[variant]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`;

  if (disabled) {
    return (
      <span className={classes} aria-disabled="true">
        {children}
      </span>
    );
  }
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      {children}
    </button>
  );
}
