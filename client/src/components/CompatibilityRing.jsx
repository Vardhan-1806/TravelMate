const CompatibilityRing = ({ score = 87, size = 'md', label = 'compatible' }) => {
  const dimensions = size === 'sm' ? 'h-14 w-14' : size === 'lg' ? 'h-28 w-28' : 'h-20 w-20';
  const radius = size === 'sm' ? 22 : size === 'lg' ? 48 : 34;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));

  return (
    <div className={`relative ${dimensions} shrink-0`} aria-label={`${progress}% ${label}`} role="img">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--color-coral)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * progress) / 100}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-text-primary)]">
        <strong className={size === 'lg' ? 'text-2xl' : 'text-base'}>{progress}%</strong>
        <span className="text-[9px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">match</span>
      </span>
    </div>
  );
};

export default CompatibilityRing;
