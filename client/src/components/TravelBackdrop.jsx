// A single quiet illustration standing in for "trips" — a horizon line,
// a dotted route between two places, and a compass mark. One tone only
// (inherits currentColor), meant to sit behind content at low opacity.
// This is the one background device reused across pages, not decoration
// invented per-screen.
const TravelBackdrop = ({ className = '' }) => (
  <svg
    viewBox="0 0 1200 500"
    preserveAspectRatio="xMidYMax slice"
    className={className}
    aria-hidden="true"
  >
    {/* distant skyline, drawn as a single continuous horizon */}
    <path
      d="M0 420 L90 420 L140 360 L190 420 L260 420 L310 300 L340 380 L400 420 L470 420 L520 260 L560 340 L610 420 L700 420 L760 330 L800 420 L900 420 L950 370 L1010 420 L1200 420"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      opacity="0.5"
    />

    {/* flight route arcing over the skyline, dashes drift slowly */}
    <path
      d="M60 300 C 260 120, 520 420, 760 180 S 1080 90, 1160 160"
      stroke="currentColor"
      strokeWidth="1.25"
      fill="none"
      className="route-line"
      opacity="0.6"
    />
    <circle cx="60" cy="300" r="3.5" fill="currentColor" opacity="0.6" />
    <circle cx="1160" cy="160" r="3.5" fill="currentColor" opacity="0.6" />

    {/* compass mark */}
    <g transform="translate(1080, 60)" opacity="0.4">
      <circle cx="0" cy="0" r="26" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M0 -18 L5 0 L0 18 L-5 0 Z" fill="currentColor" />
      <circle cx="0" cy="0" r="1.5" fill="currentColor" />
    </g>
  </svg>
);

export default TravelBackdrop;
