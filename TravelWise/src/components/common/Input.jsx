export default function Input({
  label,
  id,
  error,
  hint,
  icon: Icon,
  as = 'input',
  className = '',
  children,
  ...rest
}) {
  const Tag = as;
  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="input-wrap">
        {Icon && (
          <span className="input-icon">
            <Icon size={17} />
          </span>
        )}
        <Tag
          id={id}
          className={`input ${Icon ? 'has-icon' : ''} ${error ? 'error' : ''} ${className}`}
          {...rest}
        >
          {children}
        </Tag>
      </div>
      {error && <div className="field-error">{error}</div>}
      {!error && hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}
