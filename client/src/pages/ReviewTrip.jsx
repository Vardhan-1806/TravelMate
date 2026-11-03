import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { submitReview } from '../api/social';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import SectionLabel from '../components/SectionLabel';

const dimensions = ['reliability', 'communication', 'cooperation', 'respect'];

const ReviewTrip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [revieweeId, setRevieweeId] = useState('');
  const [comment, setComment] = useState('');
  const [ratings, setRatings] = useState(Object.fromEntries(dimensions.map((key) => [key, 5])));
  const mutation = useMutation({ mutationFn: () => submitReview(tripId, { revieweeId, ratings, comment }), onSuccess: () => navigate(`/trips/${tripId}`) });

  return <PageTransition><div className="min-h-screen bg-[var(--color-bg-primary)]"><Navbar /><main className="mx-auto max-w-2xl px-5 py-12 md:py-20"><Link to={`/trips/${tripId}`} className="text-sm font-bold text-[var(--color-text-secondary)]">← Back to trip</Link><SectionLabel className="mt-10">After the journey</SectionLabel><h1 className="mt-5 font-display text-6xl leading-none text-[var(--color-accent)]">Leave a thoughtful review.</h1><p className="mt-5 text-sm leading-7 text-[var(--color-text-secondary)]">Reviews help future travelers understand what it is like to plan and travel with someone.</p><form onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }} className="mt-9 space-y-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-sm"><label className="block text-sm font-bold text-[var(--color-text-primary)]">Traveler ID<input required value={revieweeId} onChange={(event) => setRevieweeId(event.target.value)} placeholder="The person you are reviewing" className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm font-normal text-[var(--color-text-primary)]" /></label><div className="grid gap-3 sm:grid-cols-2">{dimensions.map((dimension) => <label key={dimension} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 text-sm font-bold capitalize text-[var(--color-text-primary)]">{dimension}<select value={ratings[dimension]} onChange={(event) => setRatings({ ...ratings, [dimension]: Number(event.target.value) })} className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm font-normal">{[1, 2, 3, 4, 5].map((score) => <option key={score}>{score}</option>)}</select></label>)}</div><label className="block text-sm font-bold text-[var(--color-text-primary)]">A note for the community<textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={500} rows={4} className="mt-2 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm font-normal leading-6" /></label>{mutation.isError && <p className="text-sm text-[var(--color-danger)]">{mutation.error.response?.data?.message || 'Review could not be submitted.'}</p>}<button disabled={mutation.isPending} className="w-full rounded-xl bg-[var(--color-coral)] py-3.5 text-sm font-bold text-white">{mutation.isPending ? 'Submitting…' : 'Submit review'}</button></form></main></div></PageTransition>;
};

export default ReviewTrip;
