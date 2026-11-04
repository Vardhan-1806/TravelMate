import TransportScene from './TransportScene';

const paletteFor = (destination = '') => {
  const value = destination.toLowerCase();
  if (value.includes('goa') || value.includes('beach') || value.includes('coast')) return { sky: '#d5c7ad', horizon: '#b7c9bd', ground: '#6e8d79', water: '#416f70', sun: '#d28d65' };
  if (value.includes('manali') || value.includes('mountain') || value.includes('himachal')) return { sky: '#d5ddd6', horizon: '#a8b7ad', ground: '#506d5e', water: '#788f91', sun: '#c9a46c' };
  if (value.includes('jaipur') || value.includes('hampi') || value.includes('history')) return { sky: '#e3ccb1', horizon: '#be9b75', ground: '#87694f', water: '#74817a', sun: '#c8785e' };
  return { sky: '#d6d6c8', horizon: '#aab6a6', ground: '#657c6d', water: '#607c80', sun: '#c8a06a' };
};

const DestinationArtwork = ({ destination, transport = 'Any', className = '' }) => {
  const palette = paletteFor(destination);
  const value = destination?.toLowerCase() || '';
  const coastal = value.includes('goa') || value.includes('beach') || value.includes('coast');
  const historic = value.includes('jaipur') || value.includes('hampi');

  return (
    <div className={`destination-art ${className}`} style={{ '--art-sky': palette.sky, '--art-horizon': palette.horizon, '--art-ground': palette.ground, '--art-water': palette.water, '--art-sun': palette.sun }} aria-label={`Illustrated landscape of ${destination}`} role="img">
      <svg viewBox="0 0 640 320" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`sky-${destination}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--art-sky)" /><stop offset="1" stopColor="var(--art-horizon)" /></linearGradient>
          <filter id={`soft-${destination}`}><feGaussianBlur stdDeviation="12" /></filter>
        </defs>
        <rect width="640" height="320" fill={`url(#sky-${destination})`} />
        <circle cx="485" cy="72" r="38" fill="var(--art-sun)" opacity=".75" filter={`url(#soft-${destination})`} />
        <circle cx="485" cy="72" r="22" fill="var(--art-sun)" opacity=".88" />
        {coastal ? <><path d="M0 188 C110 165 195 208 310 184 C420 160 530 204 640 178 V320 H0Z" fill="var(--art-water)" opacity=".9" /><path d="M0 216 C130 190 210 232 330 208 C450 184 530 228 640 204" fill="none" stroke="#d8d0bc" strokeWidth="3" opacity=".65" /><path d="M0 254 C90 228 210 270 300 246 C410 216 530 270 640 236 V320 H0Z" fill="var(--art-ground)" /></> : <><path d="M0 220 L110 118 L176 193 L260 82 L350 207 L446 104 L560 214 L640 148 V320 H0Z" fill="var(--art-ground)" opacity=".92" /><path d="M0 228 L110 138 L176 202 L260 103 L350 218 L446 125 L560 224 L640 170" fill="none" stroke="var(--art-horizon)" strokeWidth="12" opacity=".8" />{historic && <><path d="M160 225 V146 H236 V225" fill="#6c5447" opacity=".82" /><path d="M148 147 L198 106 L248 147" fill="#775846" opacity=".88" /><path d="M180 225 V174 H212 V225" fill="#c4a27d" /></>}</>}
        <path d="M0 288 C120 266 214 306 320 282 C432 257 528 306 640 276 V320 H0Z" fill="#294b42" opacity=".9" />
        <path d="M40 292 C162 250 242 308 360 278 C474 250 534 296 612 270" fill="none" stroke="#d9b582" strokeWidth="2" strokeDasharray="4 11" opacity=".75" />
        <g opacity=".35" fill="#fffdf8"><circle cx="70" cy="48" r="2" /><circle cx="106" cy="86" r="1.5" /><circle cx="566" cy="126" r="2" /><circle cx="384" cy="56" r="1.5" /></g>
      </svg>
      <div className="destination-art__veil" />
      <div className="destination-art__label"><span>Destination study</span><strong>{destination || 'Open route'}</strong></div>
      <TransportScene transport={transport} />
    </div>
  );
};

export default DestinationArtwork;
