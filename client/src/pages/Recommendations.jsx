import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchRecommendations, recordRecommendationInteraction } from '../api/discovery';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import SectionLabel from '../components/SectionLabel';
import TripCard from '../components/TripCard';

const Recommendations = () => {
  const { user } = useAuth();
  const query = useQuery({ queryKey: ['recommendations'], queryFn: fetchRecommendations, enabled: Boolean(user) });
  const saveMutation = useMutation({ mutationFn: ({ tripId }) => recordRecommendationInteraction(tripId, 'SAVE') });

  return <PageTransition><div className="min-h-screen bg-[var(--color-bg-primary)]"><Navbar /><main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20"><SectionLabel>For your next escape</SectionLabel><div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h1 className="font-display text-6xl leading-none text-[var(--color-accent)]">Plans with your name on them.</h1><p className="mt-5 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">These recommendations learn from the trips you view and request. They are a starting point, not a black box.</p></div><Link to="/profile" className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-bold text-[var(--color-accent)]">Tune preferences ↗</Link></div>{query.data?.inferredInterests?.length > 0 && <div className="mt-7 flex flex-wrap gap-2">{query.data.inferredInterests.map((interest) => <span key={interest} className="rounded-full bg-[var(--color-accent-soft)] px-3 py-2 text-xs font-bold text-[var(--color-accent)]">Based on {interest}</span>)}</div>}{query.isLoading && <div className="mt-10 text-sm text-[var(--color-text-secondary)]">Finding thoughtful matches…</div>}{query.isError && <div className="mt-10 rounded-2xl bg-[var(--color-danger)]/10 p-5 text-sm text-[var(--color-danger)]">Recommendations are temporarily unavailable.</div>}{query.data?.trips?.length === 0 && <div className="mt-10 rounded-3xl border border-dashed border-[var(--color-border)] px-6 py-20 text-center"><p className="font-display text-3xl text-[var(--color-accent)]">Your recommendation trail starts with a view.</p><Link to="/discover" className="mt-5 inline-flex rounded-xl bg-[var(--color-coral)] px-5 py-3 text-sm font-bold text-white">Explore trips</Link></div>}<div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{query.data?.trips?.map((trip) => <div key={trip._id}><TripCard trip={trip} /><div className="flex items-center justify-between px-2 pt-3"><p className="text-xs text-[var(--color-text-muted)]">{trip.recommendationReason}</p><button type="button" onClick={() => saveMutation.mutate({ tripId: trip._id })} className="text-xs font-bold text-[var(--color-coral)]">Save ♡</button></div></div>)}</div></main></div></PageTransition>;
};

export default Recommendations;
