import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import PageTransition from '../components/PageTransition';
import RouteMotif from '../components/RouteMotif';

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const TAGS = [
  { label: 'Matched by compatibility', note: 'Budget, style & interests aligned', code: 'MTC' },
  { label: 'Plan together, live', note: 'Chat, itinerary & polls in one place', code: 'PLN' },
  { label: 'Split fairly', note: 'Automatic, minimal-transaction settlements', code: 'SPL' },
];

const Landing = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg-primary)] relative overflow-hidden grain">
        <div
          className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full opacity-30 blur-3xl pointer-events-none drift"
          style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-10 -right-24 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl pointer-events-none drift"
          style={{ background: 'radial-gradient(circle, var(--color-coral) 0%, transparent 70%)', animationDelay: '-6s' }}
        />

        <nav className="relative flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] transition-colors border border-[var(--color-border)]"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </motion.div>
            </button>
            <Link
              to="/login"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Get started
            </Link>
          </div>
        </nav>

        <main className="relative flex-1 flex flex-col items-center text-center px-6 max-w-2xl mx-auto pt-16 pb-28">
          <span className="text-xs font-medium tracking-wide text-[var(--color-coral)] bg-[var(--color-coral-soft)] px-3 py-1 rounded-full mb-8">
            Compatibility-based travel
          </span>

          <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight text-[var(--color-text-primary)] leading-[1.05]">
            Find your people.
            <br />
            Plan together.
          </h1>

          <div className="w-full max-w-md text-[var(--color-border)]">
            <RouteMotif className="w-full h-16 my-4" />
          </div>

          <p className="text-lg text-[var(--color-text-secondary)] max-w-md leading-relaxed">
            Discover compatible travel companions, plan trips together, and travel with confidence — all in one place.
          </p>

          <div className="mt-9 flex items-center gap-4">
            <Link
              to="/register"
              className="bg-[var(--color-coral)] hover:brightness-95 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all shadow-md shadow-[var(--color-coral)]/20"
            >
              Start planning
            </Link>
            <Link
              to="/discover"
              className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] px-6 py-3 rounded-lg text-sm font-medium transition-colors border border-[var(--color-border)]"
            >
              Browse trips
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-xl w-full">
            {TAGS.map((f) => (
              <div
                key={f.code}
                className="relative flex items-start gap-3 bg-[var(--color-bg-elevated)] border border-dashed border-[var(--color-border)] rounded-lg py-3 pl-3 pr-4"
              >
                <span className="mt-0.5 w-2.5 h-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-primary)] shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{f.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{f.note}</p>
                </div>
                <span className="absolute top-2 right-2.5 text-[10px] font-medium tracking-wide text-[var(--color-text-muted)]">
                  {f.code}
                </span>
              </div>
            ))}
          </div>
        </main>

        <footer className="relative text-center py-6 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
          TravelMate — built for travelers, by a traveler.
        </footer>
      </div>
    </PageTransition>
  );
};

export default Landing;
