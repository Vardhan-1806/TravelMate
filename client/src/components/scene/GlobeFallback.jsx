import { Link } from 'react-router-dom';

const DESTINATIONS = [
  { name: 'Goa', left: '68%', top: '66%', match: '87%' },
  { name: 'Hampi', left: '56%', top: '58%', match: '82%' },
  { name: 'Jaipur', left: '43%', top: '33%', match: '79%' },
  { name: 'Manali', left: '50%', top: '17%', match: '76%' },
];

const GlobeFallback = () => (
  <div className="relative aspect-square w-full" aria-label="Connected destinations map" role="img">
    <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_34%_25%,rgba(169,214,210,.7),transparent_28%),linear-gradient(145deg,#215b50,#0b2925_70%)] shadow-[0_40px_90px_-35px_rgba(18,60,53,.9)]" />
    <div className="absolute inset-[12%] rounded-full border border-white/20 opacity-70" />
    <div className="absolute inset-[19%] rounded-full border border-white/15 opacity-60 [transform:rotate(28deg)_scaleX(.55)]" />
    <svg viewBox="0 0 500 500" className="absolute inset-[8%] h-[84%] w-[84%]" fill="none" aria-hidden="true">
      <path d="M88 316 C150 164 255 150 350 196 S430 308 392 370" stroke="#e87952" strokeWidth="2" strokeDasharray="3 11" />
      <circle cx="88" cy="316" r="7" fill="#f7f3ea" stroke="#e87952" strokeWidth="3" />
      <circle cx="392" cy="370" r="7" fill="#f7f3ea" stroke="#e87952" strokeWidth="3" />
    </svg>
    {DESTINATIONS.map((destination) => (
      <Link
        key={destination.name}
        to={`/discover?destination=${encodeURIComponent(destination.name)}`}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-[var(--color-coral)] p-1.5 shadow-[0_0_0_5px_rgba(232,121,82,.16)] transition hover:scale-125"
        style={{ left: destination.left, top: destination.top }}
        aria-label={`Explore ${destination.name}, ${destination.match} typical compatibility`}
      >
        <span className="block h-2 w-2 rounded-full bg-white" />
      </Link>
    ))}
    <div className="absolute left-[2%] top-[15%] rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Starting from</p>
      <p className="mt-1 font-display text-lg">Hyderabad</p>
    </div>
    <div className="absolute bottom-[11%] right-0 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Selected route</p>
      <p className="mt-1 font-display text-lg">Goa · 87% match</p>
    </div>
  </div>
);

export default GlobeFallback;
