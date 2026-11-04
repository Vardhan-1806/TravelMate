import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchTrips } from '../api/trips';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PublicNav from '../components/PublicNav';
import TripCard from '../components/TripCard';
import PageTransition from '../components/PageTransition';
import SectionLabel from '../components/SectionLabel';
import TravelBackdrop from '../components/TravelBackdrop';

const TRANSPORTS = ['All transport', 'Train', 'Bus', 'Flight', 'Car', 'Any'];
const ACCOMMODATIONS = ['Any stay', 'Hostel', 'Hotel', 'Resort', 'Camping', 'Not decided'];

const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
     <div className="h-36 bg-[var(--color-bg-secondary)]" /><div className="space-y-3 p-5"><div className="h-4 w-3/4 rounded bg-[var(--color-bg-secondary)]" /><div className="h-3 w-1/2 rounded bg-[var(--color-bg-secondary)]" /><div className="h-3 w-2/3 rounded bg-[var(--color-bg-secondary)]" /></div>
   </div>
);

const Discover = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || '';
  const [draft, setDraft] = useState({ destination: initialDestination, source: '', minBudget: '', maxBudget: '', startDate: '', endDate: '', transport: '', accommodation: '', hasAvailableSeats: 'true' });
  const [filters, setFilters] = useState({ ...draft, sortBy: 'createdAt', order: 'desc', page: 1 });

  const { data, isLoading, isFetching, isError } = useQuery({ queryKey: ['trips', filters], queryFn: () => fetchTrips(filters) });

  const updateDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const applyFilters = (event) => {
    event.preventDefault();
    setFilters((current) => ({ ...current, ...draft, page: 1 }));
  };
  const clearFilters = () => {
    const reset = { destination: '', source: '', minBudget: '', maxBudget: '', startDate: '', endDate: '', transport: '', accommodation: '', hasAvailableSeats: 'true' };
    setDraft(reset);
    setFilters((current) => ({ ...current, ...reset, page: 1 }));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        {user ? <Navbar /> : <PublicNav />}
        <header className="relative overflow-hidden border-b border-[var(--color-border)] px-5 py-16 md:px-8 md:py-24">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-bg-secondary),var(--color-bg-primary))]" /><TravelBackdrop className="absolute inset-x-0 bottom-0 h-[240px] w-full text-[var(--color-accent)] opacity-[0.07]" />
          <div className="relative mx-auto max-w-6xl"><SectionLabel>Open trips</SectionLabel><div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><h1 className="font-display text-6xl leading-none text-[var(--color-accent)] md:text-7xl">Go somewhere<br /><span className="text-[var(--color-coral)]">with good people.</span></h1><p className="mt-5 max-w-lg text-sm leading-7 text-[var(--color-text-secondary)]">Search real plans, compare the details, and find a trip where your pace already makes sense.</p></div><div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 px-5 py-4 text-sm backdrop-blur"><p className="text-2xl font-bold text-[var(--color-accent)]">{data?.pagination?.total ?? '—'}</p><p className="mt-1 text-xs text-[var(--color-text-muted)]">open trips to explore</p></div></div>
            <form onSubmit={applyFilters} className="mt-10 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-xl shadow-black/5 md:p-5"><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4"><label className="md:col-span-2 lg:col-span-2"><span className="mb-1.5 block text-xs font-bold uppercase tracking-[.12em] text-[var(--color-text-muted)]">Destination</span><input value={draft.destination} onChange={(e) => updateDraft('destination', e.target.value)} placeholder="Where do you want to go?" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20" /></label><label><span className="mb-1.5 block text-xs font-bold uppercase tracking-[.12em] text-[var(--color-text-muted)]">Leaving from</span><input value={draft.source} onChange={(e) => updateDraft('source', e.target.value)} placeholder="Your city" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20" /></label><label><span className="mb-1.5 block text-xs font-bold uppercase tracking-[.12em] text-[var(--color-text-muted)]">Maximum budget</span><input type="number" min="0" value={draft.maxBudget} onChange={(e) => updateDraft('maxBudget', e.target.value)} placeholder="₹ per person" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20" /></label></div><details className="mt-4"><summary className="cursor-pointer text-xs font-bold text-[var(--color-accent)]">More filters</summary><div className="mt-4 grid gap-3 border-t border-[var(--color-border)] pt-4 sm:grid-cols-2 lg:grid-cols-4"><label><span className="mb-1.5 block text-xs font-bold text-[var(--color-text-muted)]">Earliest start</span><input type="date" value={draft.startDate} onChange={(e) => updateDraft('startDate', e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-3 text-sm text-[var(--color-text-primary)]" /></label><label><span className="mb-1.5 block text-xs font-bold text-[var(--color-text-muted)]">Latest return</span><input type="date" value={draft.endDate} onChange={(e) => updateDraft('endDate', e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-3 text-sm text-[var(--color-text-primary)]" /></label><label><span className="mb-1.5 block text-xs font-bold text-[var(--color-text-muted)]">Transport</span><select value={draft.transport} onChange={(e) => updateDraft('transport', e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-3 text-sm text-[var(--color-text-primary)]"><option value="">All transport</option>{TRANSPORTS.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label><span className="mb-1.5 block text-xs font-bold text-[var(--color-text-muted)]">Accommodation</span><select value={draft.accommodation} onChange={(e) => updateDraft('accommodation', e.target.value)} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-3 text-sm text-[var(--color-text-primary)]"><option value="">Any stay</option>{ACCOMMODATIONS.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label></div></details><div className="mt-4 flex flex-col justify-between gap-3 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center"><label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]"><input type="checkbox" checked={draft.hasAvailableSeats === 'true'} onChange={(e) => updateDraft('hasAvailableSeats', e.target.checked ? 'true' : '')} className="h-4 w-4 accent-[var(--color-accent)]" /> Only show trips with seats</label><div className="flex gap-2"><button type="button" onClick={clearFilters} className="rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">Clear</button><button type="submit" className="button-lift rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white">Search trips ↗</button></div></div></form>
             <div className="relative mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 p-3 backdrop-blur"><span className="mr-2 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--color-text-muted)]">Travel by</span>{['Train', 'Bus', 'Flight', 'Car'].map((transport) => <button type="button" key={transport} onClick={() => { updateDraft('transport', transport); setFilters((current) => ({ ...current, transport, page: 1 })); }} className={`transport-chip ${filters.transport === transport ? 'active' : ''}`}><span className="transport-chip__icon" aria-hidden="true">{transport === 'Train' ? '▰' : transport === 'Bus' ? '▣' : transport === 'Flight' ? '✦' : '●'}</span>{transport}</button>)}</div>
           </div>
         </header>

           <main className="mx-auto max-w-6xl px-5 py-10 md:px-8"><div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-sm font-bold text-[var(--color-text-primary)]">{data ? `${data.pagination.total} trip${data.pagination.total === 1 ? '' : 's'} found` : 'Finding trips'}</p><p className="mt-1 text-xs text-[var(--color-text-muted)]">Plans from travelers looking for the same kind of escape.</p></div><div className="flex items-center gap-3"><Link to="/maps" className="hidden rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs font-bold text-[var(--color-accent)] transition hover:bg-[var(--color-accent-soft)] sm:inline-flex">Open map</Link><label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">Sort by<select value={`${filters.sortBy}:${filters.order}`} onChange={(e) => { const [sortBy, order] = e.target.value.split(':'); setFilters((current) => ({ ...current, sortBy, order, page: 1 })); }} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs text-[var(--color-text-primary)]"><option value="createdAt:desc">Newest</option><option value="startDate:asc">Soonest</option><option value="budgetPerPerson:asc">Lowest budget</option><option value="budgetPerPerson:desc">Highest budget</option></select></label></div></div>
          {isFetching && !isLoading && <p className="mb-4 text-xs font-semibold text-[var(--color-accent)]" role="status">Updating trip matches…</p>}
          {isLoading && <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <SkeletonCard key={item} />)}</div>}
          {isError && <div className="rounded-3xl border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 px-6 py-12 text-center text-sm text-[var(--color-danger)]">We could not load trips right now. Check your connection and try again.</div>}
          {data && data.trips.length === 0 && <div className="rounded-3xl border border-dashed border-[var(--color-border)] px-6 py-20 text-center"><p className="font-display text-3xl text-[var(--color-accent)]">No matching trips yet.</p><p className="mt-2 text-sm text-[var(--color-text-secondary)]">Try widening your dates or budget. The right plan may be one search away.</p></div>}
           {data && data.trips.length > 0 && <motion.div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>{data.trips.map((trip, index) => <motion.div key={trip._id} className={index === 0 ? 'md:col-span-2' : ''} variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}><TripCard trip={trip} featured={index === 0} /></motion.div>)}</motion.div>}
          {data?.pagination?.totalPages > 1 && <div className="mt-10 flex justify-center gap-2">{Array.from({ length: data.pagination.totalPages }, (_, index) => index + 1).map((page) => <button type="button" key={page} onClick={() => setFilters((current) => ({ ...current, page }))} className={`h-9 w-9 rounded-xl text-sm font-bold transition ${page === filters.page ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]'}`} aria-label={`Go to page ${page}`}>{page}</button>)}</div>}
        </main>
      </div>
    </PageTransition>
  );
};

export default Discover;
