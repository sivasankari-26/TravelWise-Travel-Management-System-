export default function Card({ children, hover = true, className = '', ...rest }) {
  const classes = ['card', hover ? 'card-hover' : '', className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
