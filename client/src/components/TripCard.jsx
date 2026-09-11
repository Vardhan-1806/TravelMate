import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, WalletIcon, TransportIcon, UsersIcon } from './Icons';

// Ocean, sunset & sand — pulled from the same palette as the rest of the app,
// never arbitrary hues, so a grid of cards still reads as one brand.
const GRADIENTS = [
  'linear-gradient(135deg, #0e7c7b 0%, #17a398 100%)',
  'linear-gradient(135deg, #ff6b4a 0%, #ff9166 100%)',
  'linear-gradient(135deg, #f2b134 0%, #e89a1c 100%)',
  'linear-gradient(135deg, #0a5f5e 0%, #1c8b89 100%)',
  'linear-gradient(135deg, #c8503a 0%, #ff6b4a 100%)',
];

const gradientFor = (str) => {
  const index = str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[index];
};

const TripCard = ({ trip }) => {
  const seatsLeft = trip.maxMembers - trip.currentMembers;
  const isAlmostFull = seatsLeft <= 2;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.15 }}>
      <Link
        to={`/trips/${trip._id}`}
        className="group block bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:border-[var(--color-accent)]/40 transition-all duration-200"
      >
        <div
          className="h-28 relative flex items-end p-4 overflow-hidden"
          style={{ background: gradientFor(trip.destination) }}
        >
          <div
            className="absolute inset-0 opacity-25 map-dots text-white"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

          {/* postmark-style seat badge, stamped in the corner */}
          <span
            className={`absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${
              isAlmostFull
                ? 'bg-white/95 text-[var(--color-danger)] border-white'
                : 'bg-white/20 text-white border-white/40'
            }`}
          >
            {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
          </span>

          <span className="relative font-display text-white text-base tracking-tight">
            {trip.source} <span className="opacity-70">&rarr;</span> {trip.destination}
          </span>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
            {trip.title}
          </h3>

          <div className="grid grid-cols-2 gap-y-2 gap-x-3 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <WalletIcon className="text-[var(--color-text-muted)] shrink-0" />
              ₹{trip.budgetPerPerson.toLocaleString()}/person
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <CalendarIcon className="text-[var(--color-text-muted)] shrink-0" />
              {new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <TransportIcon className="text-[var(--color-text-muted)] shrink-0" />
              {trip.transport}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <UsersIcon className="text-[var(--color-text-muted)] shrink-0" />
              {trip.currentMembers}/{trip.maxMembers} joined
            </div>
          </div>

          {trip.tripType?.length > 0 && (
            <div className="flex gap-1.5 mt-4 flex-wrap">
              {trip.tripType.map((type) => (
                <span
                  key={type}
                  className="text-[11px] font-medium text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-2.5 py-1 rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed border-[var(--color-border)]">
            <div className="w-6 h-6 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-[10px] font-semibold flex items-center justify-center">
              {trip.creator?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Hosted by {trip.creator?.name || 'Unknown'}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TripCard;
