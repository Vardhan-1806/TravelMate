const Logo = ({ size = 'default' }) => {
  const textSize = size === 'small' ? 'text-base' : 'text-lg';
  const iconSize = size === 'small' ? 22 : 26;

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="9.5" stroke="var(--color-accent)" strokeWidth="1.4" />
        <path
          d="M12 5.5 L13.6 10.4 L18.5 12 L13.6 13.6 L12 18.5 L10.4 13.6 L5.5 12 L10.4 10.4 Z"
          fill="var(--color-accent)"
        />
      </svg>
      <span className={`${textSize} font-display font-semibold tracking-tight text-[var(--color-text-primary)]`}>
        TravelMate
      </span>
    </div>
  );
};

export default Logo;
