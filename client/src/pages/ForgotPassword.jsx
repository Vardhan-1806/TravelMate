import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api/auth';
import AuthShell from '../components/AuthShell';
import Input from '../components/Input';
import PageTransition from '../components/PageTransition';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not process that request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthShell tone="coral" quote="Every good journey has a way back in." note="We will send a private reset link if an account matches your email.">
        <p className="eyebrow text-[var(--color-coral)]">Account recovery</p>
        <h1 className="mt-5 font-display text-5xl leading-none text-[var(--color-accent)]">Find your way back.</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">Enter the email connected to your TravelMate account.</p>
        {sent ? (
          <div role="status" className="mt-8 rounded-2xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 p-5 text-sm leading-6 text-[var(--color-success)]">If an account matches that email, a reset link is on its way. Check your inbox and spam folder.</div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            <Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
            {error && <p role="alert" className="rounded-xl border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]">{error}</p>}
            <button type="submit" disabled={loading} className="button-lift w-full rounded-xl bg-[var(--color-coral)] py-3.5 text-sm font-bold text-white disabled:opacity-60">{loading ? 'Preparing a reset link…' : 'Email reset link'}</button>
          </form>
        )}
        <p className="mt-7 text-center text-sm text-[var(--color-text-secondary)]"><Link to="/login" className="font-bold text-[var(--color-accent)] hover:underline">← Back to sign in</Link></p>
      </AuthShell>
    </PageTransition>
  );
};

export default ForgotPassword;
