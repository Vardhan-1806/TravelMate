import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('TravelMate UI error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)] px-6 text-center">
        <div className="max-w-md">
          <p className="eyebrow">A small detour</p>
          <h1 className="mt-5 font-display text-5xl text-[var(--color-accent)]">This page needs a reset.</h1>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">The interface hit an unexpected error. Refresh the page to continue your journey.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-7 rounded-xl bg-[var(--color-coral)] px-5 py-3 text-sm font-bold text-white">Refresh page</button>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
