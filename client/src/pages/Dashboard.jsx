import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNotifications, markNotificationRead, respondToJoinRequest } from '../api/dashboard';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import SectionLabel from '../components/SectionLabel';

const TABS = ['Notifications', 'Requests to review'];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const joinRequestNotifs = notifications?.filter((n) => n.type === 'JOIN_REQUEST_RECEIVED') || [];
  const respondMutation = useMutation({
    mutationFn: ({ requestId, decision }) => respondToJoinRequest(requestId, decision),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <Navbar />

        <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16">
          <div className="dashboard-hero rounded-[2rem] border border-[var(--color-border)] p-6 md:p-9">
            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div><SectionLabel>Your travel desk</SectionLabel><h1 className="mt-5 font-display text-5xl leading-none text-[var(--color-accent)] md:text-6xl">Keep the journey moving.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">Requests, decisions, and the next small step—kept together so your trips feel lighter.</p></div>
              <Link to="/discover" className="button-lift inline-flex rounded-xl bg-[var(--color-coral)] px-5 py-3 text-sm font-bold text-white">Find another journey ↗</Link>
            </div>
            <div className="relative z-10 mt-8 grid max-w-xl grid-cols-3 gap-3"><div className="dashboard-stat"><strong>{notifications?.length ?? '—'}</strong><span>signals</span></div><div className="dashboard-stat"><strong>{joinRequestNotifs.length}</strong><span>requests</span></div><div className="dashboard-stat"><strong>24/7</strong><span>your pace</span></div></div>
          </div>

          <div className="flex gap-1 mt-6 border-b border-[var(--color-border)]">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="relative px-4 py-2.5 text-sm font-medium transition-colors"
                style={{ color: activeTab === i ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
              >
                {tab}
                {activeTab === i && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {isLoading && <p className="text-sm text-[var(--color-text-secondary)]">Loading...</p>}

            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {notifications?.length === 0 && (
                    <p className="text-sm text-[var(--color-text-muted)] text-center py-10">
                      No notifications yet.
                    </p>
                  )}
                  {notifications?.map((n) => (
                    <button
                      type="button"
                      key={n._id}
                      onClick={() => !n.isRead && readMutation.mutate(n._id)}
                      aria-label={n.isRead ? 'Notification read' : 'Mark notification as read'}
                      className={`p-4 rounded-xl border ${
                        n.isRead
                          ? 'bg-[var(--color-bg-elevated)] border-[var(--color-border)]'
                          : 'bg-[var(--color-accent-soft)] border-[var(--color-accent)]/30'
                      }`}
                    >
                      <p className="text-sm text-[var(--color-text-primary)]">{n.message}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </p>
                    </button>
                  ))}
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  key="requests"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {joinRequestNotifs.length === 0 ? (
                    <p className="text-sm text-[var(--color-text-muted)] text-center py-10">
                      No pending requests to review.
                    </p>
                  ) : (
                    joinRequestNotifs.map((n) => (
                      <div
                        key={n._id}
                        className="p-4 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-accent)]/30 flex items-center justify-between gap-4 shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">{n.message}</p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          {n.relatedJoinRequest && <><button type="button" onClick={() => respondMutation.mutate({ requestId: n.relatedJoinRequest, decision: 'REJECTED' })} disabled={respondMutation.isPending} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-bold text-[var(--color-danger)]">Decline</button><button type="button" onClick={() => respondMutation.mutate({ requestId: n.relatedJoinRequest, decision: 'ACCEPTED' })} disabled={respondMutation.isPending} className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold text-white">Accept</button></>}
                          {n.relatedTrip && <Link to={`/trips/${n.relatedTrip}/workspace`} className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold text-white">Open workspace ↗</Link>}
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
