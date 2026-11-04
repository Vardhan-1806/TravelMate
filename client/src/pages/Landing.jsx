import { lazy, Suspense, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import CompatibilityRing from '../components/CompatibilityRing';
import Logo from '../components/Logo';
import PageTransition from '../components/PageTransition';
import RouteMotif from '../components/RouteMotif';
import SectionLabel from '../components/SectionLabel';
import TravelBackdrop from '../components/TravelBackdrop';
import GlobeFallback from '../components/scene/GlobeFallback';
import DestinationArtwork from '../components/DestinationArtwork';

const TravelGlobe = lazy(() => import('../components/scene/TravelGlobe'));

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Arrow = () => <span aria-hidden="true">↗</span>;

const GlobeScene = () => {
  const reducedMotion = useReducedMotion();
  const [staticScene] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(pointer: coarse)').matches || Boolean(navigator.connection?.saveData) || navigator.hardwareConcurrency <= 4;
  });

  return (
    <div className="scene-shell p-3 md:p-5">
      {reducedMotion || staticScene ? <GlobeFallback /> : <Suspense fallback={<div className="aspect-square w-full animate-pulse rounded-full bg-[var(--color-accent)]/20" />}><TravelGlobe /></Suspense>}
    </div>
  );
};

const FeatureCard = ({ number, title, description, accent = 'teal' }) => (
  <motion.article
    whileHover={{ y: -6 }}
    transition={{ duration: 0.25 }}
    className="group relative overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 soft-shadow"
  >
    <div className={`mb-12 flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${accent === 'coral' ? 'bg-[var(--color-coral-soft)] text-[var(--color-coral)]' : 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'}`}>
      {number}
    </div>
    <h3 className="font-display text-2xl text-[var(--color-text-primary)]">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{description}</p>
    <div className="absolute -bottom-10 -right-8 h-28 w-28 rounded-full border border-[var(--color-border)] opacity-50 transition-transform duration-500 group-hover:scale-150" />
  </motion.article>
);

const JourneyRail = () => (
  <section className="journey-strip px-5 py-8 md:px-10">
    <div className="relative mx-auto grid max-w-7xl gap-5 md:grid-cols-[.7fr_1fr_1fr_1fr] md:items-center">
      <div className="pr-4"><p className="eyebrow">Routes in motion</p><p className="mt-3 max-w-[13rem] font-display text-2xl leading-tight text-[var(--color-accent)]">Every trip starts as a line on a map.</p></div>
      {[['Goa', 'Flight'], ['Manali', 'Train'], ['Hampi', 'Bus']].map(([destination, transport]) => (
        <Link key={destination} to={`/discover?destination=${destination}`} className="group relative h-28 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <DestinationArtwork destination={destination} transport={transport} />
          <span className="absolute bottom-3 left-4 z-10 text-xs font-bold text-white">Explore {destination} <span className="ml-1 opacity-60">↗</span></span>
        </Link>
      ))}
    </div>
  </section>
);

const Landing = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <PageTransition>
      <div className="min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
        <nav className="absolute inset-x-0 top-0 z-20 px-5 py-5 md:px-10 md:py-7">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link to="/" aria-label="TravelMate home"><Logo /></Link>
            <div className="flex items-center gap-3 md:gap-6">
              <button type="button" onClick={toggleTheme} className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 p-2.5 text-[var(--color-text-secondary)] backdrop-blur transition hover:text-[var(--color-text-primary)]" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
              <Link to="/login" className="hidden text-sm font-bold text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)] sm:block">Log in</Link>
              <Link to="/register" className="button-lift rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-bold text-white md:px-5">Get started <Arrow /></Link>
            </div>
          </div>
        </nav>

        <main>
          <section className="relative isolate min-h-[780px] overflow-hidden px-5 pb-20 pt-36 md:min-h-[850px] md:px-10 md:pt-44">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_25%,rgba(169,214,210,.35),transparent_30%),linear-gradient(135deg,var(--color-bg-primary),var(--color-bg-secondary))]" />
            <div className="surface-grid absolute inset-0 -z-10 opacity-30" />
            <TravelBackdrop className="absolute inset-x-0 bottom-0 -z-10 h-[300px] w-full text-[var(--color-accent)] opacity-[0.08]" />
            <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-2">
              <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="relative z-10 max-w-xl">
                <SectionLabel>Compatibility-based travel</SectionLabel>
                <h1 className="mt-7 font-display text-6xl leading-[.94] tracking-[-.04em] text-[var(--color-accent)] sm:text-7xl lg:text-[6.6rem]">
                  Find your people.<br /><span className="text-[var(--color-coral)]">Go further.</span>
                </h1>
                <p className="mt-7 max-w-md text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
                  TravelMate brings the right travelers together — aligned on budget, pace, interests, and the kind of memories they want to make.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link to="/register" className="button-lift rounded-xl bg-[var(--color-coral)] px-6 py-3.5 text-center text-sm font-bold text-white">Start your journey <Arrow /></Link>
                  <Link to="/discover" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 px-6 py-3.5 text-center text-sm font-bold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)]">Explore open trips</Link>
                </div>
                <div className="mt-10 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <div className="flex -space-x-2" aria-hidden="true"><span className="h-7 w-7 rounded-full border-2 border-[var(--color-bg-primary)] bg-[#d7a789]" /><span className="h-7 w-7 rounded-full border-2 border-[var(--color-bg-primary)] bg-[#6b9a8f]" /><span className="h-7 w-7 rounded-full border-2 border-[var(--color-bg-primary)] bg-[#d7c58e]" /></div>
                  <span>Built for better group travel</span>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .15 }} className="relative lg:-mr-12">
                <GlobeScene />
              </motion.div>
            </div>
            <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[var(--color-text-muted)] md:flex"><span className="h-px w-10 bg-current" />Scroll to explore<span className="h-px w-10 bg-current" /></div>
           </section>

          <JourneyRail />

          <section className="px-5 py-24 md:px-10 md:py-32">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div><SectionLabel>The TravelMate way</SectionLabel><h2 className="mt-5 max-w-lg font-display text-5xl leading-[1.02] text-[var(--color-accent)] md:text-6xl">A better beginning to every adventure.</h2></div>
              <p className="max-w-xl text-base leading-8 text-[var(--color-text-secondary)]">The best trips are not just about where you go. They are about the people who notice the same small things, move at the same pace, and make room for one another.</p>
            </div>
            <div className="mx-auto mt-14 grid max-w-7xl gap-5 md:grid-cols-3">
              <FeatureCard number="01" title="Match with intention" description="A compatibility score built from real preferences — not a random swipe. See exactly why a traveler fits your trip." />
              <FeatureCard number="02" title="Plan in one place" description="Turn a group chat into a shared plan with an itinerary, polls, budget, checklist, and a clear next step." accent="coral" />
              <FeatureCard number="03" title="Travel with trust" description="Privacy controls, report and block tools, clear group roles, and a calm safety center from the beginning." />
            </div>
          </section>

          <section className="relative overflow-hidden bg-[var(--color-accent)] px-5 py-24 text-white md:px-10 md:py-32">
            <div className="absolute right-[-8%] top-[-35%] h-[560px] w-[560px] rounded-full border border-white/10" /><div className="absolute right-[4%] top-[-20%] h-[400px] w-[400px] rounded-full border border-white/10" />
            <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_.85fr] lg:items-center">
              <div><SectionLabel className="text-[#a9d6d2]">Compatibility, made visible</SectionLabel><h2 className="mt-6 max-w-2xl font-display text-5xl leading-[1.02] md:text-7xl">Know why a trip feels right.</h2><p className="mt-6 max-w-lg leading-8 text-white/70">Travel style, dates, budget, transport, and interests come together in a match you can actually understand.</p><Link to="/register" className="mt-9 inline-flex rounded-xl bg-[var(--color-coral)] px-6 py-3.5 text-sm font-bold text-white transition hover:brightness-105">Build your travel profile <Arrow /></Link></div>
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-8"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[.16em] text-white/50">Recommended for you</p><h3 className="mt-2 font-display text-3xl">Goa, December 20–24</h3></div><CompatibilityRing score={87} size="lg" /></div><div className="mt-8 space-y-4">{[['Budget compatibility', '₹8,000 / person'], ['Shared interests', 'Beach · Food · Adventure'], ['Travel rhythm', 'Relaxed with a little spontaneity']].map(([label, value], index) => <div key={label} className="flex items-center justify-between border-t border-white/10 pt-4 text-sm"><span className="text-white/60">{label}</span><span className={index === 0 ? 'font-bold text-[#a9d6d2]' : 'font-semibold text-white'}>{value}</span></div>)}</div><p className="mt-7 rounded-xl bg-black/10 p-4 text-sm leading-6 text-white/75">“You both prefer unhurried mornings, local food, and keeping one day open for a surprise.”</p></div>
            </div>
          </section>

          <section className="px-5 py-24 md:px-10 md:py-32">
            <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><SectionLabel>From idea to memory</SectionLabel><h2 className="mt-5 font-display text-5xl leading-none text-[var(--color-accent)] md:text-6xl">One shared workspace.<br />Zero scattered plans.</h2></div><p className="max-w-sm text-sm leading-7 text-[var(--color-text-secondary)]">Every detail stays close to the people making the trip — from the first “should we?” to the last sunset.</p></div><div className="relative mt-16 grid gap-5 md:grid-cols-3"><div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 md:translate-y-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">01 · Discover</p><h3 className="mt-16 font-display text-3xl">Find a trip that sounds like you.</h3><RouteMotif className="mt-5 h-16 w-full" /></div><div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">02 · Gather</p><h3 className="mt-16 font-display text-3xl">Meet the people behind the plan.</h3><div className="mt-8 flex items-center gap-2"><span className="h-9 w-9 rounded-full bg-[#d7a789]" /><span className="h-9 w-9 rounded-full bg-[#6b9a8f]" /><span className="h-9 w-9 rounded-full bg-[#d7c58e]" /><span className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">+3</span></div></div><div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-accent-soft)] p-6 md:translate-y-16"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">03 · Go</p><h3 className="mt-16 font-display text-3xl">Make the group chat count.</h3><div className="mt-7 space-y-2 text-sm"><p className="rounded-lg bg-white/60 p-3 text-[var(--color-text-secondary)]">Poll: sunrise or slow morning?</p><p className="ml-7 rounded-lg bg-[var(--color-coral)] p-3 text-white">Slow morning wins ✨</p></div></div></div></div>
          </section>

          <section className="border-t border-[var(--color-border)] px-5 py-24 md:px-10 md:py-28"><div className="mx-auto max-w-4xl text-center"><SectionLabel>Ready when you are</SectionLabel><h2 className="mt-6 font-display text-5xl leading-none text-[var(--color-accent)] md:text-7xl">Your next adventure starts with the right people.</h2><p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[var(--color-text-secondary)]">Create your travel profile and discover a more thoughtful way to go together.</p><Link to="/register" className="button-lift mt-9 inline-flex rounded-xl bg-[var(--color-coral)] px-7 py-4 text-sm font-bold text-white">Start planning <Arrow /></Link></div></section>
        </main>

        <footer className="border-t border-[var(--color-border)] px-5 py-8 md:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center"><Link to="/"><Logo size="small" /></Link><span>Find your people. Plan together. Travel smarter.</span><span>© 2026 TravelMate</span></div></footer>
      </div>
    </PageTransition>
  );
};

export default Landing;
