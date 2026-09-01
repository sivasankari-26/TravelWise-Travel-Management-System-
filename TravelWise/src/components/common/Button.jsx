import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = '',
  block = false,
  icon: Icon,
  loading = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size ? `btn-${size}` : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={loading || rest.disabled} {...rest}>
      {loading ? <Loader2 size={17} className="spin-icon" style={{ animation: 'spin 0.7s linear infinite' }} /> : Icon && <Icon size={17} />}
      {children}
    </button>
  );
}
