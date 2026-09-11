const Logo = ({ size = 'default' }) => {
  const textSize = size === 'small' ? 'text-base' : 'text-lg';
  const iconSize = size === 'small' ? 24 : 28;

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="var(--color-accent-soft)" />
        <path
          d="M20 11.2c.4-.1.9.1 1 .6.1.4-.1.9-.6 1l-4.6 1.4-1.3 4.4c-.1.4-.6.6-1 .4a.8.8 0 0 1-.4-1l.7-4-2.1.6-1 1.7c-.2.3-.6.4-.9.2a.7.7 0 0 1-.3-.9l.6-1.6-1.6-.6a.7.7 0 0 1-.2-.9c.2-.3.6-.4.9-.3l1.7.6 1-2-4 .6a.8.8 0 0 1-1-.5c-.1-.4.1-.9.5-1l4.4-1.4L14.2 3.4c.1-.4.6-.6 1-.4.4.1.6.6.4 1L14.2 8.6l4.6-1.4z"
          fill="var(--color-coral)"
        />
      </svg>
      <span className={`${textSize} font-display font-semibold tracking-tight text-[var(--color-text-primary)]`}>
        TravelMate
      </span>
    </div>
  );
};

export default Logo;
