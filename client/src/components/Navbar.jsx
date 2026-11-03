import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const links = [
    { to: '/discover', label: 'Explore' },
    { to: '/matches', label: 'Matches' },
    { to: '/dashboard', label: 'My trips' },
  ];
  const secondaryLinks = [
    { to: '/profile', label: 'Profile' },
    { to: '/recommendations', label: 'For you' },
    { to: '/ai-planner', label: 'AI planner' },
    { to: '/maps', label: 'Explore nearby' },
    { to: '/safety', label: 'Safety center' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/85 px-5 py-4 backdrop-blur-xl md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link to="/discover" aria-label="TravelMate home">
            <Logo size="small" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  location.pathname === link.to
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="relative">
              <button type="button" onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} className="rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]">
                More <span aria-hidden="true">⌄</span>
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-11 z-40 w-48 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 shadow-2xl">
                  {secondaryLinks.map((link) => <Link key={link.to} to={link.to} onClick={() => setMoreOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]">{link.label}</Link>)}
                  {user?.role === 'ADMIN' && <Link to="/admin" onClick={() => setMoreOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--color-coral)] transition hover:bg-[var(--color-coral-soft)]">Admin moderation</Link>}
                </div>
              )}
            </div>
            <Link to="/create-trip" className="button-lift ml-2 rounded-xl bg-[var(--color-coral)] px-4 py-2 text-sm font-bold text-white">
              Host a trip <span aria-hidden="true">↗</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="ml-2 rounded-full p-2 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-elevated)]"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }} className="block">
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </button>

            <div className="ml-2 flex items-center gap-2 border-l border-[var(--color-border)] pl-3">
              <Link to="/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xs font-bold text-[var(--color-accent)]" aria-label="Open profile">
                {user?.name?.[0]?.toUpperCase()}
              </Link>
              <button type="button" onClick={handleLogout} className="text-xs font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-danger)]">
                Log out
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xl border border-[var(--color-border)] p-2 text-[var(--color-text-secondary)] md:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1.5 block h-0.5 w-5 bg-current" />
          </button>
        </div>

        {menuOpen && (
          <div className="mt-4 grid gap-1 border-t border-[var(--color-border)] pt-3 md:hidden">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]">
                {link.label}
              </Link>
            ))}
            {secondaryLinks.map((link) => <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]">{link.label}</Link>)}
            {user?.role === 'ADMIN' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-[var(--color-coral)] hover:bg-[var(--color-coral-soft)]">Admin moderation</Link>}
            <Link to="/create-trip" onClick={() => setMenuOpen(false)} className="mt-1 rounded-xl bg-[var(--color-coral)] px-3 py-3 text-center text-sm font-bold text-white">
              Host a trip
            </Link>
            <div className="mt-2 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
              <span className="text-xs text-[var(--color-text-muted)]">Signed in as {user?.name}</span>
              <div className="flex gap-3">
                <button type="button" onClick={toggleTheme} className="text-xs font-semibold text-[var(--color-text-secondary)]">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
                <button type="button" onClick={handleLogout} className="text-xs font-semibold text-[var(--color-danger)]">Log out</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mobile-tab-bar md:hidden" aria-label="Primary navigation">
        {links.map((link) => <Link key={link.to} to={link.to} className={location.pathname.startsWith(link.to) ? 'mobile-tab active' : 'mobile-tab'}>{link.label}</Link>)}
        <Link to="/profile" className={location.pathname.startsWith('/profile') ? 'mobile-tab active' : 'mobile-tab'}>Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
