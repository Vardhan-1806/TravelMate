import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNotifications, markNotificationRead, respondToJoinRequest } from '../api/dashboard';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';

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

        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Your dashboard</h1>

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
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
