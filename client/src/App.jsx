import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Discover = lazy(() => import('./pages/Discover'));
const TripDetail = lazy(() => import('./pages/TripDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateTrip = lazy(() => import('./pages/CreateTrip'));
const TripWorkspace = lazy(() => import('./pages/TripWorkspace'));
const Profile = lazy(() => import('./pages/Profile'));
const Matches = lazy(() => import('./pages/Matches'));
const SafetyCenter = lazy(() => import('./pages/SafetyCenter'));
const ReviewTrip = lazy(() => import('./pages/ReviewTrip'));
const AdminModeration = lazy(() => import('./pages/AdminModeration'));
const AIPlanner = lazy(() => import('./pages/AIPlanner'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const MapExplorer = lazy(() => import('./pages/MapExplorer'));

const PageLoader = () => (
  <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)]" role="status">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-coral)]" />
  </main>
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/trips/:tripId" element={<TripDetail />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/matches" element={<Matches />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/trips/:tripId/workspace" element={<TripWorkspace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/safety" element={<SafetyCenter />} />
            <Route path="/trips/:tripId/review" element={<ReviewTrip />} />
            <Route path="/admin" element={<AdminModeration />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/maps" element={<MapExplorer />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
