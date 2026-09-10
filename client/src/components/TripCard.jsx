import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, WalletIcon, TransportIcon, UsersIcon } from './Icons';

const GRADIENTS = [
  'linear-gradient(135deg, #6b5b95 0%, #8a9fd6 100%)',
  'linear-gradient(135deg, #4a7c59 0%, #6b9b7a 100%)',
  'linear-gradient(135deg, #b8860b 0%, #d4a94f 100%)',
  'linear-gradient(135deg, #5a7ba0 0%, #7fa8c9 100%)',
  'linear-gradient(135deg, #a05a7b 0%, #c98aa8 100%)',
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
        className="group block bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[var(--color-accent)]/40 transition-all duration-200"
      >
        <div
          className="h-24 relative flex items-end p-4"
          style={{ background: gradientFor(trip.destination) }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <span className="relative text-white/90 text-xs font-medium tracking-wide">
            {trip.source} → {trip.destination}
          </span>
          <span
            className={`absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${
              isAlmostFull
                ? 'bg-white/90 text-[var(--color-danger)]'
                : 'bg-white/25 text-white'
            }`}
          >
            {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
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

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
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