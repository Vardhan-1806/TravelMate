import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, WalletIcon, TransportIcon, UsersIcon } from './Icons';
import DestinationArtwork from './DestinationArtwork';

// Same restrained palette as the rest of the app, each just a shade of one
// tone — enough to tell cards apart without a grid of trips looking loud.
const TripCard = ({ trip, featured = false }) => {
  const seatsLeft = trip.maxMembers - trip.currentMembers;
  const isAlmostFull = seatsLeft <= 2;

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className={featured ? 'md:col-span-2' : ''}>
      <Link
        to={`/trips/${trip._id}`}
        className={`group block overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] transition-all duration-300 hover:border-[var(--color-accent)]/50 hover:shadow-[0_24px_60px_-38px_rgba(18,60,53,.72)] ${featured ? 'md:grid md:grid-cols-[1.1fr_.9fr]' : ''}`}
      >
        <div className={`${featured ? 'h-56 md:h-full' : 'h-36'} relative overflow-hidden`}>
          <DestinationArtwork destination={trip.destination} transport={trip.transport} />
          <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm ${isAlmostFull ? 'border-white bg-white/95 text-[var(--color-danger)]' : 'border-white/40 bg-white/20 text-white'}`}>{seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left</span>
          <div className="absolute bottom-4 left-5 z-10 font-display text-xl tracking-tight text-white md:text-2xl">{trip.source} <span className="opacity-70">&rarr;</span> {trip.destination}</div>
        </div>

        <div className={`${featured ? 'p-6 md:p-7' : 'p-5'}`}>
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent)]">
            {trip.title}
            </h3>
            {trip.compatibilityScore && <span className="shrink-0 rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--color-accent)]">{trip.compatibilityScore}% fit</span>}
          </div>

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
          {featured && <div className="editorial-rule mt-5" />}
        </div>
      </Link>
    </motion.div>
  );
};

export default TripCard;
