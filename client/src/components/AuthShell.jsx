import { Link } from 'react-router-dom';
import Logo from './Logo';
import RouteMotif from './RouteMotif';

const AuthShell = ({ children, quote, note, tone = 'teal' }) => (
  <div className="min-h-screen bg-[var(--color-bg-primary)] lg:grid lg:grid-cols-2">
    <aside className={`relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between ${tone === 'coral' ? 'bg-[#9f5b45]' : 'bg-[var(--color-accent)]'}`}>
      <div className="absolute inset-0 opacity-10 map-dots" aria-hidden="true" />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full border border-white/15" aria-hidden="true" />
      <div className="absolute -bottom-20 -right-12 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
      <Link to="/" className="relative"><Logo /></Link>
      <div className="relative max-w-md">
        <p className="font-display text-5xl leading-[1.02]">{quote}</p>
        <RouteMotif className="mt-10 h-16 w-full" color="#fff" />
        <p className="mt-6 max-w-sm text-sm leading-6 text-white/65">{note}</p>
      </div>
      <p className="relative text-xs uppercase tracking-[.18em] text-white/45">TravelMate · better journeys, together</p>
    </aside>
    <main className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 flex lg:hidden"><Logo /></Link>
        {children}
      </div>
    </main>
  </div>
);

export default AuthShell;
