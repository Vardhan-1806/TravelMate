import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchMyProfile, updateMyProfile } from '../api/profile';
import { fetchReputation } from '../api/social';
import { useAuth } from '../context/AuthContext';
import CompatibilityRing from '../components/CompatibilityRing';
import Input from '../components/Input';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import SectionLabel from '../components/SectionLabel';

const TRAVEL_STYLES = ['Backpacker', 'Budget', 'Luxury', 'Adventure', 'Relaxed', 'Photography', 'Nature', 'Trekking', 'Cultural', 'Food', 'Road Trip', 'Solo'];
const INTERESTS = ['Beaches', 'Mountains', 'Trekking', 'Photography', 'Food', 'Nightlife', 'History', 'Wildlife', 'Shopping', 'Camping', 'Adventure'];
const TRANSPORTS = ['Any', 'Train', 'Bus', 'Flight', 'Car'];

const PreferenceGroup = ({ title, description, options, selected, onToggle, tone = 'teal' }) => (
  <fieldset>
    <legend className="text-base font-bold text-[var(--color-text-primary)]">{title}</legend>
    <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">{description}</p>
    <div className="mt-4 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            type="button"
            key={option}
            aria-pressed={active}
            onClick={() => onToggle(option)}
            className={`rounded-full border px-3.5 py-2 text-xs font-bold transition ${active
              ? tone === 'coral' ? 'border-[var(--color-coral)] bg-[var(--color-coral)] text-white' : 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
              : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]'}`}
          >
            <span aria-hidden="true" className="mr-1">{active ? '✓' : '+'}</span>{option}
          </button>
        );
      })}
    </div>
  </fieldset>
);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [travelStyle, setTravelStyle] = useState([]);
  const [interests, setInterests] = useState([]);
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(0);
  const [transportPreference, setTransportPreference] = useState('Any');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const { data: profile, isLoading, isError } = useQuery({ queryKey: ['profile'], queryFn: fetchMyProfile, enabled: Boolean(user) });
  const reputationQuery = useQuery({ queryKey: ['reputation', user?.id], queryFn: () => fetchReputation(user.id), enabled: Boolean(user?.id) });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!profile) return;
    setName(profile.name || '');
    setCity(profile.profile?.city || '');
    setBio(profile.profile?.bio || '');
    setTravelStyle(profile.travelPreferences?.travelStyle || []);
    setInterests(profile.travelPreferences?.interests || []);
    setMinBudget(profile.travelPreferences?.budgetRange?.min || 0);
    setMaxBudget(profile.travelPreferences?.budgetRange?.max || 0);
    setTransportPreference(profile.travelPreferences?.transportPreference || 'Any');
  }, [profile]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const completion = useMemo(() => {
    const checks = [name.trim(), city.trim(), bio.trim(), travelStyle.length, interests.length, Number(maxBudget) > 0, transportPreference !== 'Any'];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [name, city, bio, travelStyle, interests, maxBudget, transportPreference]);

  const mutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(['profile'], updated);
      updateUser({ name: updated.name, email: updated.email });
      setStatusMessage({ text: 'Profile saved. Your match explanations will now be more personal.', type: 'success' });
    },
    onError: (error) => setStatusMessage({ text: error.response?.data?.message || 'Profile could not be saved.', type: 'error' }),
  });

  const toggle = (setter, current, value) => setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  const handleSave = (event) => {
    event.preventDefault();
    const min = Number(minBudget) || 0;
    const max = Number(maxBudget) || 0;
    if (max > 0 && max < min) {
      setStatusMessage({ text: 'Your maximum budget must be at least your minimum budget.', type: 'error' });
      return;
    }
    setStatusMessage({ text: '', type: '' });
    mutation.mutate({
      name,
      profile: { city, bio },
      travelPreferences: { travelStyle, interests, budgetRange: { min, max }, transportPreference },
    });
  };

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)] p-6 text-center"><div><h2 className="font-display text-3xl text-[var(--color-accent)]">Sign in to shape your profile</h2><Link to="/login" className="mt-5 inline-flex rounded-xl bg-[var(--color-coral)] px-5 py-3 text-sm font-bold text-white">Sign in</Link></div></div>;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg-primary)] pb-20"><Navbar /><main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[.68fr_1.32fr] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <SectionLabel>Your travel profile</SectionLabel>
            <h1 className="mt-5 font-display text-5xl leading-none text-[var(--color-accent)] md:text-6xl">Tell your people what makes a good trip.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">The more you share, the more useful your compatibility score becomes. You control what appears on your public profile.</p>
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 soft-shadow"><CompatibilityRing score={completion} size="sm" /><div><p className="text-sm font-bold text-[var(--color-text-primary)]">Profile readiness</p><p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">Complete your preferences to get better recommendations.</p></div></div>
            <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4"><p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--color-text-muted)]">Traveler reputation</p><p className="mt-2 font-display text-3xl text-[var(--color-accent)]">{reputationQuery.data?.averages?.overall || '—'}<span className="ml-1 text-sm text-[var(--color-text-muted)]">/ 5</span></p><p className="mt-1 text-xs text-[var(--color-text-secondary)]">{reputationQuery.data?.totalReviews || 0} completed reviews</p><Link to="/safety" className="mt-4 inline-block text-xs font-bold text-[var(--color-coral)]">Open Safety Center ↗</Link></div>
          </aside>

          <div>
            {statusMessage.text && <div role="status" className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${statusMessage.type === 'success' ? 'border-[var(--color-success)]/20 bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 text-[var(--color-danger)]'}`}>{statusMessage.text}</div>}
            {isLoading ? <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-sm text-[var(--color-text-secondary)]">Loading your profile…</div> : isError ? <div className="rounded-3xl border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 p-8 text-sm text-[var(--color-danger)]">We could not load your profile. Refresh and try again.</div> : (
              <form onSubmit={handleSave} className="space-y-5">
                <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 soft-shadow md:p-7"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">01</p><h2 className="mt-1 font-display text-3xl text-[var(--color-text-primary)]">The basics</h2></div><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-soft)] font-display text-xl text-[var(--color-accent)]">{name?.[0]?.toUpperCase() || '?'}</div></div><div className="grid gap-5 md:grid-cols-2"><Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required /><Input label="Current city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Hyderabad, Bengaluru…" maxLength={80} /></div><div className="mt-5"><label htmlFor="bio" className="mb-1.5 block text-sm font-semibold text-[var(--color-text-primary)]">A little about you</label><textarea id="bio" rows={4} maxLength={300} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What would a good travel buddy know about you?" className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm leading-6 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20" /><p className="mt-1 text-right text-xs text-[var(--color-text-muted)]">{bio.length}/300</p></div></section>
                <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 soft-shadow md:p-7"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">02</p><h2 className="mt-1 font-display text-3xl text-[var(--color-text-primary)]">Your travel rhythm</h2></div><PreferenceGroup title="Travel styles" description="Choose up to the styles that feel most like you." options={TRAVEL_STYLES} selected={travelStyle} onToggle={(value) => toggle(setTravelStyle, travelStyle, value)} /></section>
                <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 soft-shadow md:p-7"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">03</p><h2 className="mt-1 font-display text-3xl text-[var(--color-text-primary)]">What pulls you out there?</h2></div><PreferenceGroup title="Interests and activities" description="These overlaps help us explain why someone might be a good match." options={INTERESTS} selected={interests} onToggle={(value) => toggle(setInterests, interests, value)} tone="coral" /></section>
                <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 soft-shadow md:p-7"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">04</p><h2 className="mt-1 font-display text-3xl text-[var(--color-text-primary)]">Make the numbers work</h2></div><div className="grid gap-5 md:grid-cols-3"><Input label="Minimum budget (₹)" type="number" min="0" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} /><Input label="Maximum budget (₹)" type="number" min="0" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} /><div><label htmlFor="transport" className="mb-1.5 block text-sm font-semibold text-[var(--color-text-primary)]">Preferred transport</label><select id="transport" value={transportPreference} onChange={(e) => setTransportPreference(e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20">{TRANSPORTS.map((transport) => <option key={transport}>{transport}</option>)}</select></div></div></section>
                <button type="submit" disabled={mutation.isPending} className="button-lift w-full rounded-2xl bg-[var(--color-accent)] py-4 text-sm font-bold text-white disabled:opacity-60">{mutation.isPending ? 'Saving your profile…' : 'Save profile and preferences'}</button>
              </form>
            )}
          </div>
        </div>
      </main></div>
    </PageTransition>
  );
};

export default Profile;
