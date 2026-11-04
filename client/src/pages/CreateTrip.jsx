import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createTrip } from '../api/trips';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import SectionLabel from '../components/SectionLabel';
import DestinationArtwork from '../components/DestinationArtwork';

const TRIP_STYLES = [
  'Backpacker',
  'Budget',
  'Luxury',
  'Adventure',
  'Relaxed',
  'Photography',
  'Nature',
  'Trekking',
  'Cultural',
  'Food',
  'Road Trip',
  'Solo',
];

const TRANSPORTS = ['Any', 'Train', 'Bus', 'Flight', 'Car'];
const ACCOMMODATIONS = ['Not decided', 'Hostel', 'Hotel', 'Resort', 'Camping'];

const CreateTrip = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budgetPerPerson: '',
    maxMembers: 4,
    description: '',
    tripType: [],
    transport: 'Any',
    accommodation: 'Not decided',
    meetingPoint: '',
    requirements: '',
  });

  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: createTrip,
    onSuccess: (data) => {
      const tripId = data.trip?._id || data._id;
      navigate(tripId ? `/trips/${tripId}` : '/discover');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create trip. Please check your inputs.');
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleStyle = (style) => {
    setForm((prev) => {
      const exists = prev.tripType.includes(style);
      return {
        ...prev,
        tripType: exists
          ? prev.tripType.filter((s) => s !== style)
          : [...prev.tripType, style],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.source.trim() || !form.destination.trim() || !form.startDate || !form.endDate || !form.budgetPerPerson) {
      setError('Please fill in all required fields.');
      return;
    }

    if (new Date(form.startDate) > new Date(form.endDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    if (form.source.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      setError('Source and destination should be different places.');
      return;
    }

    if (Number(form.budgetPerPerson) <= 0 || Number(form.maxMembers) < 2 || Number(form.maxMembers) > 20) {
      setError('Budget must be positive and group size must be between 2 and 20.');
      return;
    }

    mutation.mutate({
      ...form,
      title: form.title.trim(),
      source: form.source.trim(),
      destination: form.destination.trim(),
      budgetPerPerson: Number(form.budgetPerPerson),
      maxMembers: Number(form.maxMembers),
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Please log in to host a trip</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">Create an account or sign in to start coordinating trips.</p>
        <Link
          to="/login"
          className="mt-5 px-5 py-2.5 bg-[var(--color-coral)] text-white text-sm font-medium rounded-xl shadow-md hover:brightness-95 transition-all"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <Navbar />

        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
          <div className="mb-8">
            <Link to="/discover" className="text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]">
              &larr; Back to discover
            </Link>
            <SectionLabel className="mt-8">Host a trip</SectionLabel>
            <h1 className="font-display text-5xl leading-none text-[var(--color-accent)] mt-4">
              Create a new trip
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-4 max-w-xl leading-7">
              Set destination, travel styles, and find travelers who match your vibe.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_.38fr] lg:items-start">
          <form onSubmit={handleSubmit} className="space-y-7 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-xl shadow-black/5 md:p-8">
            {error && (
              <div className="p-3 text-sm rounded-lg bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/20">
                {error}
              </div>
            )}

            <section>
              <p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">01 · The journey</p>
              <Input
                label="Trip Title *"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g. Monsoon Road Trip to Goa & Coastal Treks"
                required
              />
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Departing From (Source) *"
                name="source"
                value={form.source}
                onChange={handleInputChange}
                placeholder="e.g. Hyderabad"
                required
              />
              <Input
                label="Destination *"
                name="destination"
                value={form.destination}
                onChange={handleInputChange}
                placeholder="e.g. Goa"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleInputChange}
                required
              />
              <Input
                label="End Date *"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Estimated Budget / Person (₹) *"
                type="number"
                name="budgetPerPerson"
                min="1"
                value={form.budgetPerPerson}
                onChange={handleInputChange}
                placeholder="e.g. 8000"
                required
              />
              <Input
                label="Max Group Size *"
                type="number"
                name="maxMembers"
                min="2"
                max="20"
                value={form.maxMembers}
                onChange={handleInputChange}
                placeholder="e.g. 5"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                  Transport Preference
                </label>
                <select
                  name="transport"
                  value={form.transport}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                >
                  {TRANSPORTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                  Accommodation Style
                </label>
                <select
                  name="accommodation"
                  value={form.accommodation}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                >
                  {ACCOMMODATIONS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <section>
              <p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">02 · The vibe</p>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                Trip Style Tags (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {TRIP_STYLES.map((style) => {
                  const selected = form.tripType.includes(style);
                  return (
                    <button
                      type="button"
                      key={style}
                      aria-pressed={selected}
                      onClick={() => toggleStyle(style)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selected
                          ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                          : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}{style}
                    </button>
                  );
                })}
              </div>
            </section>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Description & Plan
              </label>
              <textarea
                name="description"
                rows={4}
                maxLength={1000}
                value={form.description}
                onChange={handleInputChange}
                placeholder="Share your vision for this trip, highlights, or what kind of co-travelers you are looking for..."
                className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm leading-6 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Meeting Point (Optional)"
                name="meetingPoint"
                value={form.meetingPoint}
                onChange={handleInputChange}
                placeholder="e.g. Secunderabad Railway Station Gate 1"
              />
              <Input
                label="Requirements / Notes (Optional)"
                name="requirements"
                value={form.requirements}
                onChange={handleInputChange}
                placeholder="e.g. Must know swimming, valid ID proof"
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="button-lift w-full rounded-xl bg-[var(--color-coral)] py-3.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {mutation.isPending ? 'Publishing Trip...' : 'Publish Trip & Find Travelers'}
            </button>
          </form>
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-xl shadow-black/5">
              <div className="h-56"><DestinationArtwork destination={form.destination || 'Goa'} transport={form.transport} /></div>
              <div className="p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">Live trip preview</p><h2 className="mt-3 font-display text-3xl leading-tight text-[var(--color-accent)]">{form.title || 'Your next shared journey'}</h2><p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{form.source || 'Your city'} → {form.destination || 'A place worth going'}.</p><div className="mt-5 editorial-rule" /><p className="mt-4 text-xs leading-5 text-[var(--color-text-muted)]">A clear route, a thoughtful description, and the right travel style help compatible people find you.</p></div>
            </div>
          </aside>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CreateTrip;
