import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const PublicNav = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/85 px-5 py-4 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" aria-label="TravelMate home"><Logo size="small" /></Link>
        <div className="flex items-center gap-3">
          <button type="button" onClick={toggleTheme} className="rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? '☼' : '◐'}
          </button>
          <Link to="/login" className="hidden text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] sm:block">Log in</Link>
          <Link to="/register" className="rounded-xl bg-[var(--color-coral)] px-4 py-2.5 text-sm font-bold text-white">Join TravelMate</Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNav;
