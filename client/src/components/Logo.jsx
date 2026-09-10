const Logo = ({ size = 'default' }) => {
  const textSize = size === 'small' ? 'text-base' : 'text-lg';
  const iconSize = size === 'small' ? 22 : 26;

  return (
    <div className="flex items-center gap-2">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C12 22 19 15.4183 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.4183 12 22 12 22Z"
          fill="var(--color-accent)"
          fillOpacity="0.15"
          stroke="var(--color-accent)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="3" fill="var(--color-accent)" />
      </svg>
      <span className={`${textSize} font-semibold tracking-tight text-[var(--color-text-primary)]`}>
        TravelMate
      </span>
    </div>
  );
};

export default Logo;