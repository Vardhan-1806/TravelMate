import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchMyMatches } from '../api/tripDetail';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, WalletIcon, TransportIcon } from '../components/Icons';
import CompatibilityRing from '../components/CompatibilityRing';
import SectionLabel from '../components/SectionLabel';

const Matches = () => {
  const { user } = useAuth();

  const { data: matches, isLoading, isError } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMyMatches,
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Log in to view compatibility matches</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          TravelMate uses your travel preferences to calculate compatibility scores.
        </p>
        <Link to="/login" className="mt-4 px-5 py-2.5 bg-[var(--color-coral)] text-white text-sm font-medium rounded-xl">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg-primary)] pb-12">
        <Navbar />

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <SectionLabel>Algorithm-ranked</SectionLabel>
              <h1 className="font-display text-5xl leading-none text-[var(--color-accent)] mt-5">
                Your Compatible Trips
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Trips ranked by weighted destination, budget range, travel style, and transport preferences using a Min-Heap Top-K selection.
              </p>
            </div>
            <Link
              to="/profile"
              className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-4 py-2 rounded-xl hover:border-[var(--color-accent)] transition-all self-start md:self-auto"
            >
              Tune Preferences ⚙
            </Link>
          </div>

          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] animate-pulse">
                  <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-1/3 mb-2" />
                  <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-1/4" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="p-8 text-center text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 rounded-2xl">
              Unable to compute compatibility matches. Please try again.
            </div>
          )}

          {matches && matches.length === 0 && (
            <div className="text-center py-16 bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] p-8">
              <p className="text-base font-medium text-[var(--color-text-primary)]">No matching trips found yet</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-md mx-auto">
                Make sure your travel preferences are filled out in your profile, or browse all open trips.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <Link to="/profile" className="px-4 py-2 text-sm bg-[var(--color-accent)] text-white rounded-xl">
                  Update Profile
                </Link>
                <Link to="/discover" className="px-4 py-2 text-sm bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)]">
                  Browse All Trips
                </Link>
              </div>
            </div>
          )}

          {matches && matches.length > 0 && (
            <div className="space-y-5">
              {matches.map((match) => {
                const trip = match.trip || {};
                const tripId = match.tripId || trip._id;
                return (
                  <motion.div
                    key={tripId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-accent)]/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--color-accent)] tracking-wide">
                            {trip.source || 'Any'} &rarr; {trip.destination || 'Destination'}
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mt-1">
                          {trip.title || 'Trip'}
                        </h2>
                      </div>

                      <CompatibilityRing score={match.compatibility} size="lg" />
                    </div>

                    {/* Reasons list */}
                    {match.reasons?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {match.reasons.map((r) => (
                          <span
                            key={r}
                            className="text-[11px] font-medium text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-2.5 py-0.5 rounded-full"
                          >
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    )}

                      {/* Explainable score breakdown */}
                      {match.breakdown && (
                        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-4 sm:grid-cols-3">
                          {Object.entries({ destination: 'Destination', budget: 'Budget', travelStyle: 'Travel style', interests: 'Interests', transport: 'Transport', dates: 'Dates' }).map(([key, label]) => {
                            const score = match.breakdown[key] ?? 0;
                            return <div key={key}><div className="mb-1 flex justify-between text-[11px] text-[var(--color-text-muted)]"><span>{label}</span><span>{score}%</span></div><div className="h-1.5 w-full rounded-full bg-[var(--color-bg-secondary)]"><div className={`${key === 'budget' || key === 'interests' ? 'bg-[var(--color-coral)]' : 'bg-[var(--color-accent)]'} h-1.5 rounded-full`} style={{ width: `${score}%` }} /></div></div>;
                          })}
                        </div>
                      )}

                    {/* Trip summary footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-3 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-4">
                        {trip.budgetPerPerson && (
                          <span className="flex items-center gap-1 font-medium text-[var(--color-text-primary)]">
                            <WalletIcon className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                            ₹{trip.budgetPerPerson.toLocaleString()}
                          </span>
                        )}
                        {trip.startDate && (
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                            {new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        {trip.transport && (
                          <span className="flex items-center gap-1">
                            <TransportIcon className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                            {trip.transport}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/trips/${tripId}`}
                        className="px-4 py-1.5 bg-[var(--color-coral)] hover:brightness-95 text-white font-medium rounded-lg transition-all"
                      >
                        View Trip &rarr;
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Matches;
