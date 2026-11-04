import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/AuthShell';
import Input from '../components/Input';
import PageTransition from '../components/PageTransition';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || '/discover', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'We could not sign you in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthShell quote="The trips worth taking are the ones you don't plan alone." note="Log back in to see your matches, chats, and open trip requests.">
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-5 font-display text-5xl leading-none text-[var(--color-accent)]">Pick up where you left off.</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">Sign in to keep planning with your people.</p>
        <form onSubmit={handleSubmit} className="mt-9 space-y-5" noValidate>
          <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
           <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" required />
           <div className="-mt-2 text-right"><Link to="/forgot-password" className="text-xs font-bold text-[var(--color-accent)] hover:underline">Forgot password?</Link></div>
          {error && <p role="alert" className="rounded-xl border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]">{error}</p>}
          <button type="submit" disabled={loading} className="button-lift w-full rounded-xl bg-[var(--color-coral)] py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing you in…' : 'Sign in'}</button>
        </form>
        <p className="mt-7 text-center text-sm text-[var(--color-text-secondary)]">New to TravelMate? <Link to="/register" className="font-bold text-[var(--color-accent)] hover:underline">Create an account</Link></p>
      </AuthShell>
    </PageTransition>
  );
};

export default Login;
