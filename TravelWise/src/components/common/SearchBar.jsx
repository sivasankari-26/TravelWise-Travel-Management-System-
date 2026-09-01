import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`input-wrap ${className}`}>
      <span className="input-icon">
        <Search size={17} />
      </span>
      <input
        className="input has-icon"
        style={{ paddingRight: value ? 40 : 16 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button className="input-suffix-btn" onClick={() => onChange('')} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
