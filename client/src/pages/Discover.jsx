import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchTrips } from '../api/trips';
import TripCard from '../components/TripCard';
import { SearchIcon, WalletIcon } from '../components/Icons';
import PageTransition from '../components/PageTransition';

const SkeletonCard = () => (
  <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden animate-pulse">
    <div className="h-28 bg-[var(--color-bg-secondary)]" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-3/4" />
      <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-1/2" />
    </div>
  </div>
);

const Discover = () => {
  const [filters, setFilters] = useState({ destination: '', maxBudget: '', page: 1 });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['trips', filters],
    queryFn: () => fetchTrips(filters),
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <div className="relative overflow-hidden border-b border-[var(--color-border)] px-6 py-14 grain">
          <div
            className="absolute inset-0 opacity-90"
            style={{ background: 'linear-gradient(180deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%)' }}
          />
          <div
            className="absolute -top-32 left-1/3 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl pointer-events-none drift"
            style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -top-20 right-10 w-[280px] h-[280px] rounded-full opacity-20 blur-3xl pointer-events-none drift"
            style={{ background: 'radial-gradient(circle, var(--color-coral) 0%, transparent 70%)', animationDelay: '-4s' }}
          />

          <div className="relative max-w-5xl mx-auto text-center">
            <span className="text-xs font-medium tracking-wide text-[var(--color-coral)] bg-[var(--color-coral-soft)] px-3 py-1 rounded-full">
              Open trips
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--color-text-primary)] tracking-tight mt-4">
              Find your next trip
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              {data ? `${data.pagination.total} open trip${data.pagination.total !== 1 ? 's' : ''} waiting for a travel buddy` : 'Browse trips looking for companions'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-7 max-w-xl mx-auto">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  placeholder="Where do you want to go?"
                  value={filters.destination}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
                />
              </div>
              <div className="relative sm:w-44">
                <WalletIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="number"
                  placeholder="Max budget"
                  value={filters.maxBudget}
                  onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {isError && (
            <p className="text-sm text-[var(--color-danger)] text-center py-12">
              Couldn't load trips. Please try again.
            </p>
          )}

          {data && data.trips.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-[var(--color-text-secondary)]">No trips match your search yet.</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Try a different destination or budget.</p>
            </div>
          )}

          {data && data.trips.length > 0 && (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
              >
                {data.trips.map((trip) => (
                  <motion.div
                    key={trip._id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <TripCard trip={trip} />
                  </motion.div>
                ))}
              </motion.div>

              {data.pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
                      className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                        p === filters.page
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Discover;
