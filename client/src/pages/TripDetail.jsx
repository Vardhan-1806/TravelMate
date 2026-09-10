import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchTripById, fetchMyMatches, requestToJoin } from '../api/tripDetail';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, WalletIcon, TransportIcon, UsersIcon } from '../components/Icons';
import PageTransition from '../components/PageTransition';

const TripDetail = () => {
  const { tripId } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState('');

  const { data: trip, isLoading, isError } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => fetchTripById(tripId),
  });

  const { data: matches } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMyMatches,
    enabled: !!user,
  });

  const myMatch = matches?.find((m) => m.tripId === tripId);

  const joinMutation = useMutation({
    mutationFn: () => requestToJoin(tripId, message),
    onSuccess: () => setRequestSent(true),
    onError: (err) => setRequestError(err.response?.data?.message || 'Something went wrong'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <p className="text-sm text-[var(--color-text-secondary)]">Loading trip...</p>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <p className="text-sm text-[var(--color-danger)]">Trip not found.</p>
      </div>
    );
  }

  const seatsLeft = trip.maxMembers - trip.currentMembers;
  const isOwnTrip = user && trip.creator?._id === user.id;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link to="/discover" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors">
            ← Back to discover
          </Link>

          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">{trip.source} → {trip.destination}</p>
              <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-primary)] mt-1">
                {trip.title}
              </h1>
            </div>

            {myMatch && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="shrink-0 text-center bg-[var(--color-accent-soft)] rounded-xl px-4 py-3"
              >
                <p className="text-xl font-semibold text-[var(--color-accent)]">{myMatch.compatibility}%</p>
                <p className="text-[10px] text-[var(--color-accent)] uppercase tracking-wide">match</p>
              </motion.div>
            )}
          </div>

          {myMatch?.reasons?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-3">
              {myMatch.reasons.map((reason) => (
                <span key={reason} className="text-[11px] text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-2.5 py-1 rounded-full">
                  ✓ {reason}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-5 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl">
            <div>
              <WalletIcon className="text-[var(--color-text-muted)] mb-1.5" />
              <p className="text-sm font-medium text-[var(--color-text-primary)]">₹{trip.budgetPerPerson.toLocaleString()}</p>
              <p className="text-xs text-[var(--color-text-muted)]">per person</p>
            </div>
            <div>
              <CalendarIcon className="text-[var(--color-text-muted)] mb-1.5" />
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                to {new Date(trip.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <TransportIcon className="text-[var(--color-text-muted)] mb-1.5" />
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{trip.transport}</p>
              <p className="text-xs text-[var(--color-text-muted)]">transport</p>
            </div>
            <div>
              <UsersIcon className="text-[var(--color-text-muted)] mb-1.5" />
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{trip.currentMembers}/{trip.maxMembers}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{seatsLeft} seats left</p>
            </div>
          </div>

          {trip.description && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">About this trip</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{trip.description}</p>
            </div>
          )}

          {trip.tripType?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-6">
              {trip.tripType.map((type) => (
                <span key={type} className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)] px-2.5 py-1 rounded-md">
                  {type}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[var(--color-border)]">
            <div className="w-9 h-9 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-sm font-semibold flex items-center justify-center">
              {trip.creator?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{trip.creator?.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Trip organizer</p>
            </div>
          </div>

          <div className="mt-8">
            {!user && (
              <Link
                to="/login"
                className="block text-center w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white py-3 rounded-xl text-sm font-medium transition-colors"
              >
                Log in to request to join
              </Link>
            )}

            {user && isOwnTrip && (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-3">
                This is your trip.
              </p>
            )}

            {user && !isOwnTrip && seatsLeft <= 0 && (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-3 bg-[var(--color-bg-secondary)] rounded-xl">
                This trip is full.
              </p>
            )}

            {user && !isOwnTrip && seatsLeft > 0 && !requestSent && (
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself to the host (optional)"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all resize-none"
                />
                {requestError && (
                  <p className="text-sm text-[var(--color-danger)] mt-2">{requestError}</p>
                )}
                <button
                  onClick={() => joinMutation.mutate()}
                  disabled={joinMutation.isPending}
                  className="w-full mt-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  {joinMutation.isPending ? 'Sending request...' : 'Request to join'}
                </button>
              </div>
            )}

            {requestSent && (
              <p className="text-sm text-[var(--color-success)] bg-[var(--color-success)]/10 rounded-xl px-4 py-3 text-center">
                Request sent! The organizer will review it soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default TripDetail;