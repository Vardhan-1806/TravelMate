import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import AuthShell from '../components/AuthShell';
import Input from '../components/Input';
import PageTransition from '../components/PageTransition';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!token) return setStatus({ type: 'error', message: 'This reset link is missing its token.' });
    if (password.length < 8) return setStatus({ type: 'error', message: 'Use at least 8 characters for your password.' });
    if (password !== confirmation) return setStatus({ type: 'error', message: 'The passwords do not match.' });
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await resetPassword({ token, password });
      setStatus({ type: 'success', message: 'Password updated. Taking you to sign in…' });
      window.setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (requestError) {
      setStatus({ type: 'error', message: requestError.response?.data?.message || 'This reset link is invalid or expired.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthShell quote="A fresh password. A clear route ahead." note="Reset links are single-use and expire after 15 minutes.">
        <p className="eyebrow">New credentials</p>
        <h1 className="mt-5 font-display text-5xl leading-none text-[var(--color-accent)]">Choose a new password.</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">Make it unique to TravelMate and easy for you to remember.</p>
        <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
          <Input label="New password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
          <Input label="Confirm password" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" minLength={8} required />
          {status.message && <p role={status.type === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${status.type === 'success' ? 'border-[var(--color-success)]/20 bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10 text-[var(--color-danger)]'}`}>{status.message}</p>}
          <button type="submit" disabled={loading} className="button-lift w-full rounded-xl bg-[var(--color-accent)] py-3.5 text-sm font-bold text-white disabled:opacity-60">{loading ? 'Updating password…' : 'Update password'}</button>
        </form>
        <p className="mt-7 text-center text-sm text-[var(--color-text-secondary)]"><Link to="/login" className="font-bold text-[var(--color-accent)] hover:underline">Back to sign in</Link></p>
      </AuthShell>
    </PageTransition>
  );
};

export default ResetPassword;
