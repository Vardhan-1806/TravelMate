import { motion } from 'framer-motion';

// A dashed flight route with a plane that travels it once on load.
// Deliberately the one "orchestrated moment" on any page that uses it —
// everything else on these screens stays still.
const RouteMotif = ({ className = '', color = 'var(--color-coral)' }) => (
  <svg
    viewBox="0 0 400 120"
    fill="none"
    className={className}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M4 90 C 90 10, 180 130, 260 40 S 380 10, 396 30"
      stroke="currentColor"
      strokeWidth="1.5"
      className="route-line text-[var(--color-border)]"
      fill="none"
    />
    <motion.g
      initial={{ offsetDistance: '0%', opacity: 0 }}
      animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
      transition={{ duration: 3.2, ease: 'easeInOut', delay: 0.4 }}
      style={{
        offsetPath: "path('M4 90 C 90 10, 180 130, 260 40 S 380 10, 396 30')",
        offsetRotate: 'auto',
      }}
    >
      <path d="M0 -4 L6 0 L0 4 L1.5 0 Z" fill={color} />
    </motion.g>
  </svg>
);

export default RouteMotif;
