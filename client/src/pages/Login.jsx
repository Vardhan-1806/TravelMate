import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Logo from '../components/Logo';
import PageTransition from '../components/PageTransition';
import RouteMotif from '../components/RouteMotif';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/discover');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex">
        {/* travel panel — hidden on small screens */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12 grain">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)' }}
          />
          <div className="absolute inset-0 opacity-10 map-dots text-white" aria-hidden="true" />
          <div className="relative text-white max-w-sm">
            <p className="font-display text-3xl leading-snug">
              "The trips worth taking are the ones you don't plan alone."
            </p>
            <div className="text-white/60 mt-8">
              <RouteMotif className="w-full h-14" color="#fff" />
            </div>
            <p className="text-sm text-white/70 mt-6">
              Log back in to see your matches, chats, and open trip requests.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm">
            <Link to="/" className="flex justify-center mb-8 lg:hidden">
              <Logo />
            </Link>

            <h1 className="font-display text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Welcome back</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Log in to continue planning</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              {error && (
                <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-coral)] hover:brightness-95 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-[var(--color-coral)]/20"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-[var(--color-accent)] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
