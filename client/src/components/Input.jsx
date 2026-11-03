const Input = ({ label, type = 'text', value, onChange, error, id, hint, ...props }) => {
  const inputId = id || `field-${label?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'input'}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
        {...props}
      />
      {hint && !error && <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-[var(--color-text-muted)]">{hint}</p>}
      {error && <p id={`${inputId}-error`} className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
};

export default Input;
