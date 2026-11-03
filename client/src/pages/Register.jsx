import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/AuthShell';
import Input from '../components/Input';
import PageTransition from '../components/PageTransition';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      setSuccess(true);
      window.setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'We could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthShell tone="coral" quote="Build a profile once. Get matched to every trip after." note="Budget, travel style, and interests — tell us once, and we will use them to make every recommendation more meaningful.">
        <p className="eyebrow text-[var(--color-coral)]">Your travel profile</p>
        <h1 className="mt-5 font-display text-5xl leading-none text-[var(--color-accent)]">Start with the people.</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">Create your account, then shape the kind of trips you want to find.</p>
        {success ? (
          <div role="status" className="mt-9 rounded-2xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 p-5 text-sm leading-6 text-[var(--color-success)]">Account created. Taking you to sign in…</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-9 space-y-5" noValidate>
            <Input label="Your name" value={name} onChange={(e) => setName(e.target.value)} placeholder="What should your travel people call you?" autoComplete="name" required />
            <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} hint="Use a unique password you do not use elsewhere." required />
            {error && <p role="alert" className="rounded-xl border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]">{error}</p>}
            <button type="submit" disabled={loading} className="button-lift w-full rounded-xl bg-[var(--color-coral)] py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Creating your profile…' : 'Create account'}</button>
            <p className="text-center text-xs leading-5 text-[var(--color-text-muted)]">By continuing, you agree to be respectful and honest with the people you travel with.</p>
          </form>
        )}
        <p className="mt-7 text-center text-sm text-[var(--color-text-secondary)]">Already have an account? <Link to="/login" className="font-bold text-[var(--color-accent)] hover:underline">Sign in</Link></p>
      </AuthShell>
    </PageTransition>
  );
};

export default Register;
