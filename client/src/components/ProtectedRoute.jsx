import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center px-6">
        <div className="text-center" role="status" aria-live="polite">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-coral)]" />
          <p className="text-sm text-[var(--color-text-secondary)]">Preparing your journey…</p>
        </div>
      </main>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

export default ProtectedRoute;
