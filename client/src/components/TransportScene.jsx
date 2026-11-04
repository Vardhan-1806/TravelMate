const TRANSPORT_META = {
  Train: { label: 'Rail line', icon: '▰' },
  Bus: { label: 'Road route', icon: '▣' },
  Flight: { label: 'Air route', icon: '✦' },
  Car: { label: 'Open road', icon: '●' },
  Any: { label: 'Flexible route', icon: '⌁' },
};

const TransportScene = ({ transport = 'Any' }) => {
  const meta = TRANSPORT_META[transport] || TRANSPORT_META.Any;
  return (
    <div className={`transport-scene transport-scene--${transport.toLowerCase()}`} aria-label={`${meta.label} transport`}>
      <svg viewBox="0 0 240 90" className="h-full w-full" fill="none" aria-hidden="true">
        <path d="M5 72 C58 45 108 66 154 39 C184 22 207 26 235 13" stroke="rgba(255,253,248,.72)" strokeWidth="1.5" strokeDasharray="3 8" />
        {transport === 'Flight' ? <path d="M136 48 l22 -8 9 3 -8 3 8 3 -10 1 -8 -2 -7 4z" fill="#fffdf8" /> : <g className="transport-vehicle"><circle cx="147" cy="47" r="9" fill="#e87952" /><text x="147" y="51" textAnchor="middle" fill="#fffdf8" fontSize="10">{meta.icon}</text></g>}
      </svg>
      <span>{meta.label}</span>
    </div>
  );
};

export default TransportScene;
