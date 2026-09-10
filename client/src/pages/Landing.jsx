import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import PageTransition from '../components/PageTransition';

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

const Landing = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg-primary)] relative overflow-hidden">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
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

        <main className="relative flex-1 flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto pt-24 pb-32">
          <span className="text-xs font-medium tracking-wide uppercase text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-3 py-1 rounded-full mb-6">
            Compatibility-based travel
          </span>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[var(--color-text-primary)] leading-[1.1]">
            Find your people.
            <br />
            <span className="text-[var(--color-accent)]">Plan together.</span>
          </h1>

          <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-md leading-relaxed">
            Discover compatible travel companions, plan trips together, and travel with confidence — all in one place.
          </p>

          <div className="mt-9 flex items-center gap-4">
            <Link
              to="/register"
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
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

          <div className="mt-16 grid grid-cols-3 gap-8 text-left max-w-xl w-full">
            {[
              { title: 'Matched by compatibility', desc: 'Budget, style, and interests aligned' },
              { title: 'Plan together, live', desc: 'Chat, itinerary, and polls in one place' },
              { title: 'Split fairly', desc: 'Automatic, minimal-transaction settlements' },
            ].map((f) => (
              <div key={f.title}>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{f.title}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </main>

        <footer className="relative text-center py-6 text-xs text-[var(--color-text-muted)]">
          TravelMate — built for travelers, by a traveler.
        </footer>
      </div>
    </PageTransition>
  );
};

export default Landing;