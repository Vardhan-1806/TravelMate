import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCustomPreparationItem,
  addExpense,
  addItineraryItem,
  askAiAssistant,
  createPoll,
  fetchBudget,
  fetchChatHistory,
  fetchItinerary,
  fetchPolls,
  fetchPreparationList,
  fetchReadiness,
  fetchSettlement,
  fetchWorkspaceOverview,
  generatePreparationList,
  saveBudget,
  togglePreparationItem,
  votePoll,
} from '../api/workspace';
import { getAccessToken } from '../lib/authToken';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import CompatibilityRing from '../components/CompatibilityRing';

const TABS = [
  { id: 'chat', label: 'Chat' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'polls', label: 'Polls' },
  { id: 'expenses', label: 'Budget' },
  { id: 'prep', label: 'Preparation' },
  { id: 'ai', label: 'AI assistant' },
  { id: 'members', label: 'Members' },
];

const CATEGORIES = ['transport', 'accommodation', 'food', 'activities', 'emergency', 'miscellaneous'];

const Panel = ({ children, className = '' }) => (
  <section className={`rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-sm md:p-7 ${className}`}>{children}</section>
);

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[var(--color-text-muted)]">{label}</span>
    <input {...props} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3.5 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20" />
  </label>
);

const TripWorkspace = () => {
  const { tripId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('chat');
  const [notice, setNotice] = useState('');

  const workspaceQuery = useQuery({ queryKey: ['workspace', tripId], queryFn: () => fetchWorkspaceOverview(tripId), enabled: Boolean(user) });
  const workspace = workspaceQuery.data;

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [socketStatus, setSocketStatus] = useState('connecting');
  const socketRef = useRef(null);
  const chatScrollRef = useRef(null);
  const historyQuery = useQuery({ queryKey: ['chatHistory', tripId], queryFn: () => fetchChatHistory(tripId), enabled: Boolean(user) && activeTab === 'chat' });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (historyQuery.data?.messages) setMessages(historyQuery.data.messages);
  }, [historyQuery.data]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!user || !workspace) return undefined;
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', { auth: { token: getAccessToken() }, withCredentials: true });
    socketRef.current = socket;
    socket.on('connect', () => { setSocketStatus('connected'); socket.emit('join-trip-room', tripId); });
    socket.on('disconnect', () => setSocketStatus('offline'));
    socket.on('connect_error', () => setSocketStatus('offline'));
    socket.on('new-message', (message) => setMessages((current) => current.some((item) => item._id === message._id) ? current : [...current, message]));
    socket.on('error', (error) => setNotice(error.message || 'Chat action failed'));
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [tripId, user, workspace]);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages, activeTab]);

  const itineraryQuery = useQuery({ queryKey: ['itinerary', tripId], queryFn: () => fetchItinerary(tripId), enabled: activeTab === 'itinerary' });
  const pollsQuery = useQuery({ queryKey: ['polls', tripId], queryFn: () => fetchPolls(tripId), enabled: activeTab === 'polls' });
  const settlementQuery = useQuery({ queryKey: ['settlement', tripId], queryFn: () => fetchSettlement(tripId), enabled: activeTab === 'expenses' });
  const budgetQuery = useQuery({ queryKey: ['budget', tripId], queryFn: () => fetchBudget(tripId), enabled: activeTab === 'expenses', retry: false });
  const prepQuery = useQuery({ queryKey: ['preparation', tripId], queryFn: () => fetchPreparationList(tripId), enabled: activeTab === 'prep' });
  const readinessQuery = useQuery({ queryKey: ['readiness', tripId], queryFn: () => fetchReadiness(tripId), enabled: activeTab === 'prep' });

  const [item, setItem] = useState({ title: '', location: '', date: '', estimatedCost: '' });
  const [poll, setPoll] = useState({ question: '', options: ['', ''] });
  const [expense, setExpense] = useState({ description: '', amount: '', category: 'Food' });
  const [budget, setBudget] = useState(Object.fromEntries(CATEGORIES.map((category) => [category, { estimated: '', actual: '' }])));
  const [customItem, setCustomItem] = useState({ category: 'Personal', item: '' });
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (budgetQuery.data?.budget?.categories) {
      setBudget(budgetQuery.data.budget.categories);
    }
  }, [budgetQuery.data]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const invalidate = (key) => queryClient.invalidateQueries({ queryKey: [key, tripId] });
  const itineraryMutation = useMutation({ mutationFn: (data) => addItineraryItem(tripId, data), onSuccess: () => { invalidate('itinerary'); setItem({ title: '', location: '', date: '', estimatedCost: '' }); setNotice('Itinerary updated'); } });
  const pollMutation = useMutation({ mutationFn: (data) => createPoll(tripId, data), onSuccess: () => { invalidate('polls'); setPoll({ question: '', options: ['', ''] }); setNotice('Poll published'); } });
  const voteMutation = useMutation({ mutationFn: ({ pollId, option }) => votePoll(pollId, option), onSuccess: () => invalidate('polls') });
  const expenseMutation = useMutation({ mutationFn: (data) => addExpense(tripId, data), onSuccess: () => { invalidate('settlement'); setExpense({ description: '', amount: '', category: 'Food' }); setNotice('Expense recorded'); } });
  const budgetMutation = useMutation({ mutationFn: (categories) => saveBudget(tripId, categories), onSuccess: () => { invalidate('budget'); invalidate('readiness'); setNotice('Budget saved'); } });
  const prepGenerateMutation = useMutation({ mutationFn: () => generatePreparationList(tripId), onSuccess: () => { invalidate('preparation'); invalidate('readiness'); setNotice('Checklist generated'); } });
  const prepToggleMutation = useMutation({ mutationFn: togglePreparationItem, onSuccess: () => { invalidate('preparation'); invalidate('readiness'); } });
  const customItemMutation = useMutation({ mutationFn: (data) => addCustomPreparationItem(tripId, data), onSuccess: () => { invalidate('preparation'); setCustomItem({ category: 'Personal', item: '' }); } });

  const sendMessage = (event) => {
    event.preventDefault();
    if (!chatInput.trim() || !socketRef.current) return;
    socketRef.current.emit('send-message', { tripId, content: chatInput.trim() });
    setChatInput('');
  };
  const addItinerary = (event) => { event.preventDefault(); itineraryMutation.mutate({ ...item, estimatedCost: Number(item.estimatedCost) || 0 }); };
  const publishPoll = () => pollMutation.mutate({ question: poll.question, options: poll.options });
  const addExpenseEntry = (event) => {
    event.preventDefault();
    const participantIds = (workspace?.members || []).map((member) => member.user?._id || member.user);
    expenseMutation.mutate({ ...expense, amount: Number(expense.amount), splitType: 'EQUAL', participantIds });
  };
  const askAi = async (event) => {
    event.preventDefault();
    if (!aiQuestion.trim()) return;
    setAiAnswer('');
    try { const response = await askAiAssistant(tripId, aiQuestion); setAiAnswer(response.answer || 'No answer returned.'); } catch (error) { setAiAnswer(error.response?.data?.message || 'The assistant is temporarily unavailable.'); }
  };

  if (workspaceQuery.isLoading) return <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)] text-sm text-[var(--color-text-secondary)]">Loading your private workspace…</div>;
  if (workspaceQuery.isError || !workspace?.trip) return <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg-primary)] p-6 text-center"><h1 className="font-display text-4xl text-[var(--color-accent)]">Workspace unavailable</h1><p className="mt-3 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">You need to be an accepted member of this trip to enter its private workspace.</p><Link to="/discover" className="mt-6 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-bold text-white">Back to discover</Link></div>;

  const { trip, members, yourRole } = workspace;
  const memberName = (id) => members.find((member) => (member.user?._id || member.user)?.toString() === id?.toString())?.user?.name || 'Traveler';
  const packedItems = prepQuery.data?.items?.filter((itemEntry) => itemEntry.isPacked).length || 0;
  const totalItems = prepQuery.data?.items?.length || 0;

  return (
    <PageTransition>
       <div className="min-h-screen bg-[var(--color-bg-primary)]"><Navbar />
         <header className="workspace-hero border-b border-[var(--color-border)] px-5 py-7 md:px-8"><div className="relative z-10 mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="flex items-center gap-2"><span className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">Private workspace</span><span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--color-accent)]">{yourRole}</span></div><h1 className="mt-3 font-display text-4xl leading-none text-[var(--color-accent)] md:text-5xl">{trip.title}</h1><p className="mt-3 text-sm text-[var(--color-text-secondary)]">{trip.source} → {trip.destination} · {new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}–{new Date(trip.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} · {members.length}/{trip.maxMembers} travelers</p></div><Link to={`/trips/${tripId}`} className="text-sm font-bold text-[var(--color-coral)]">Public trip details ↗</Link></div><div className="mt-7 flex gap-2 overflow-x-auto pb-1">{TABS.map((tab) => <button type="button" key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeTab === tab.id ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`} aria-selected={activeTab === tab.id}>{tab.label}</button>)}</div></div></header>

        <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">{notice && <button type="button" onClick={() => setNotice('')} className="mb-5 w-full rounded-xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 px-4 py-3 text-left text-sm text-[var(--color-success)]">{notice} <span className="float-right">×</span></button>}
          {activeTab === 'chat' && <Panel className="flex h-[640px] flex-col p-0"><div className="flex items-center justify-between border-b border-[var(--color-border)] p-5"><div><h2 className="font-display text-2xl text-[var(--color-text-primary)]">The group room</h2><p className="mt-1 text-xs text-[var(--color-text-muted)]">Coordinate openly before the trip starts.</p></div><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] ${socketStatus === 'connected' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]'}`}>{socketStatus}</span></div><div ref={chatScrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">{messages.length === 0 ? <div className="flex h-full items-center justify-center text-center text-sm text-[var(--color-text-muted)]">No messages yet.<br />Start the plan with a hello.</div> : messages.map((message, index) => { const isMe = (message.sender?._id || message.sender)?.toString() === user.id?.toString(); return <div key={message._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[82%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}><span className="mb-1 px-1 text-[10px] text-[var(--color-text-muted)]">{message.sender?.name || 'Traveler'}</span><p className={`rounded-2xl px-4 py-3 text-sm leading-6 ${isMe ? 'rounded-br-sm bg-[var(--color-accent)] text-white' : 'rounded-bl-sm bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'}`}>{message.content}</p></div></div>; })}</div><form onSubmit={sendMessage} className="flex gap-2 border-t border-[var(--color-border)] p-4"><input aria-label="Message" value={chatInput} onChange={(event) => setChatInput(event.target.value)} maxLength={2000} placeholder="Write to the group…" className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20" /><button className="rounded-xl bg-[var(--color-coral)] px-5 py-3 text-sm font-bold text-white">Send</button></form></Panel>}

          {activeTab === 'itinerary' && <div className="grid gap-5 lg:grid-cols-[.75fr_1.25fr]"><Panel><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">Shared plan</p><h2 className="mt-2 font-display text-3xl text-[var(--color-text-primary)]">Add a stop</h2><form onSubmit={addItinerary} className="mt-6 space-y-4"><Field label="Activity" value={item.title} onChange={(event) => setItem({ ...item, title: event.target.value })} placeholder="Sunset at the fort" required /><Field label="Location" value={item.location} onChange={(event) => setItem({ ...item, location: event.target.value })} placeholder="Optional" /><div className="grid gap-3 sm:grid-cols-2"><Field label="Date" type="date" value={item.date} onChange={(event) => setItem({ ...item, date: event.target.value })} required /><Field label="Estimated ₹" type="number" min="0" value={item.estimatedCost} onChange={(event) => setItem({ ...item, estimatedCost: event.target.value })} placeholder="0" /></div><button disabled={itineraryMutation.isPending} className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-sm font-bold text-white">{itineraryMutation.isPending ? 'Adding…' : 'Add to itinerary'}</button></form></Panel><Panel><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">Day by day</p><h2 className="mt-2 font-display text-3xl text-[var(--color-text-primary)]">The route so far</h2></div><span className="text-xs text-[var(--color-text-muted)]">{itineraryQuery.data?.items?.length || 0} stops</span></div><div className="mt-7 space-y-3">{itineraryQuery.data?.items?.length ? itineraryQuery.data.items.map((entry, index) => <div key={entry._id} className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-sm font-bold text-[var(--color-accent)]">{index + 1}</div><div className="min-w-0 flex-1"><h3 className="text-sm font-bold text-[var(--color-text-primary)]">{entry.title}</h3><p className="mt-1 text-xs text-[var(--color-text-secondary)]">{entry.location || 'Location to be decided'} · {new Date(entry.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p></div>{entry.estimatedCost > 0 && <span className="text-xs font-bold text-[var(--color-coral)]">₹{entry.estimatedCost.toLocaleString()}</span>}</div>) : <p className="rounded-2xl border border-dashed border-[var(--color-border)] px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">Your first activity will make this trip feel real.</p>}</div></Panel></div>}

          {activeTab === 'polls' && <div className="grid gap-5 lg:grid-cols-[.75fr_1.25fr]"><Panel><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">Group decision</p><h2 className="mt-2 font-display text-3xl text-[var(--color-text-primary)]">Ask the room</h2><div className="mt-6 space-y-3"><Field label="Question" value={poll.question} onChange={(event) => setPoll({ ...poll, question: event.target.value })} placeholder="Where should we eat on day one?" />{poll.options.map((option, index) => <Field key={index} label={`Option ${index + 1}`} value={option} onChange={(event) => setPoll({ ...poll, options: poll.options.map((current, itemIndex) => itemIndex === index ? event.target.value : current) })} placeholder="Add an option" />)}<div className="flex gap-2"><button type="button" onClick={() => setPoll({ ...poll, options: [...poll.options, ''] })} className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-xs font-bold text-[var(--color-accent)]">+ Option</button><button type="button" onClick={publishPoll} disabled={pollMutation.isPending || !poll.question.trim()} className="flex-1 rounded-xl bg-[var(--color-coral)] px-4 py-3 text-xs font-bold text-white">Publish poll</button></div></div></Panel><Panel><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">Open questions</p><div className="mt-5 space-y-4">{pollsQuery.data?.polls?.length ? pollsQuery.data.polls.map((entry) => <div key={entry._id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4"><div className="flex justify-between gap-3"><h3 className="text-sm font-bold text-[var(--color-text-primary)]">{entry.question}</h3><span className="text-[10px] text-[var(--color-text-muted)]">{entry.totalVotes} votes</span></div><div className="mt-4 space-y-2">{entry.options.map((option) => { const votes = entry.tally?.[option] || 0; const selected = entry.myVote === option; return <button type="button" key={option} disabled={Boolean(entry.myVote) || entry.status !== 'OPEN' || voteMutation.isPending} onClick={() => voteMutation.mutate({ pollId: entry._id, option })} className={`relative w-full overflow-hidden rounded-xl border px-3 py-2.5 text-left text-xs font-bold ${selected ? 'border-[var(--color-coral)] text-[var(--color-coral)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'}`}><span className="relative z-10 flex justify-between"><span>{option}</span><span>{votes}</span></span><span className="absolute inset-y-0 left-0 bg-[var(--color-coral-soft)]" style={{ width: `${entry.totalVotes ? (votes / entry.totalVotes) * 100 : 0}%` }} /></button>; })}</div></div>) : <p className="rounded-2xl border border-dashed border-[var(--color-border)] px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">No group questions yet.</p>}</div></Panel></div>}

          {activeTab === 'expenses' && <div className="space-y-5"><Panel><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">Money, made clear</p><h2 className="mt-2 font-display text-3xl text-[var(--color-text-primary)]">Shared budget</h2><p className="mt-2 text-sm text-[var(--color-text-secondary)]">Set estimates first, then record what the group actually spends.</p></div>{budgetQuery.data && <div className="text-right"><p className="text-2xl font-bold text-[var(--color-accent)]">₹{budgetQuery.data.totalEstimated?.toLocaleString() || 0}</p><p className="text-xs text-[var(--color-text-muted)]">estimated total</p></div>}</div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{CATEGORIES.map((category) => <div key={category} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3"><p className="mb-2 text-xs font-bold capitalize text-[var(--color-text-secondary)]">{category}</p><input type="number" min="0" aria-label={`${category} estimate`} value={budget[category]?.estimated ?? ''} onChange={(event) => setBudget({ ...budget, [category]: { ...budget[category], estimated: event.target.value } })} placeholder="Estimated ₹" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs text-[var(--color-text-primary)]" /></div>)}</div><button type="button" onClick={() => budgetMutation.mutate(budget)} disabled={budgetMutation.isPending} className="mt-5 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-xs font-bold text-white">{budgetMutation.isPending ? 'Saving…' : 'Save budget plan'}</button></Panel><div className="grid gap-5 lg:grid-cols-[.75fr_1.25fr]"><Panel><h2 className="font-display text-2xl text-[var(--color-text-primary)]">Record an expense</h2><form onSubmit={addExpenseEntry} className="mt-5 space-y-4"><Field label="Description" value={expense.description} onChange={(event) => setExpense({ ...expense, description: event.target.value })} placeholder="Fuel, hotel, ferry…" required /><Field label="Amount ₹" type="number" min="1" value={expense.amount} onChange={(event) => setExpense({ ...expense, amount: event.target.value })} required /><label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[var(--color-text-muted)]">Category</span><select value={expense.category} onChange={(event) => setExpense({ ...expense, category: event.target.value })} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3.5 py-3 text-sm text-[var(--color-text-primary)]"><option>Hotel</option><option>Food</option><option>Transport</option><option>Tickets</option><option>Activities</option><option>Miscellaneous</option></select></label><p className="text-xs leading-5 text-[var(--color-text-muted)]">Split equally between all {members.length} confirmed travelers.</p><button className="w-full rounded-xl bg-[var(--color-coral)] py-3 text-sm font-bold text-white">Record expense</button></form></Panel><Panel><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">Greedy settlement</p><h2 className="mt-2 font-display text-2xl text-[var(--color-text-primary)]">Who pays whom</h2></div><span className="text-[10px] font-bold text-[var(--color-text-muted)]">O(N log N)</span></div><div className="mt-5 space-y-3">{settlementQuery.data?.transactions?.length ? settlementQuery.data.transactions.map((transaction, index) => <div key={index} className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 text-sm"><span><strong>{memberName(transaction.from)}</strong><span className="text-[var(--color-text-muted)]"> pays </span><strong>{memberName(transaction.to)}</strong></span><span className="font-bold text-[var(--color-success)]">₹{transaction.amount}</span></div>) : <p className="rounded-2xl border border-dashed border-[var(--color-border)] px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">No unsettled balances yet.</p>}</div></Panel></div></div>}

          {activeTab === 'prep' && <div className="grid gap-5 lg:grid-cols-[.68fr_1.32fr]"><Panel><div className="flex items-center gap-4"><CompatibilityRing score={readinessQuery.data?.overall || (totalItems ? Math.round((packedItems / totalItems) * 100) : 0)} size="lg" /><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">Trip readiness</p><h2 className="mt-2 font-display text-3xl text-[var(--color-text-primary)]">Pack with confidence.</h2><p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{readinessQuery.data?.pending?.[0] || 'Your group is ready to go.'}</p></div></div><button type="button" onClick={() => prepGenerateMutation.mutate()} disabled={prepGenerateMutation.isPending} className="mt-7 w-full rounded-xl bg-[var(--color-accent)] py-3 text-sm font-bold text-white">{prepGenerateMutation.isPending ? 'Generating…' : 'Generate activity checklist'}</button><div className="mt-5 border-t border-[var(--color-border)] pt-5"><p className="text-xs font-bold text-[var(--color-text-secondary)]">Add your own item</p><div className="mt-3 flex gap-2"><input value={customItem.item} onChange={(event) => setCustomItem({ ...customItem, item: event.target.value })} placeholder="Offline maps, medication…" className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-3 text-xs text-[var(--color-text-primary)]" /><button type="button" onClick={() => customItemMutation.mutate(customItem)} disabled={!customItem.item.trim()} className="rounded-xl border border-[var(--color-border)] px-3 text-xs font-bold text-[var(--color-accent)]">Add</button></div></div></Panel><Panel><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">Personal checklist</p><h2 className="mt-2 font-display text-3xl text-[var(--color-text-primary)]">Ready, set, pack.</h2></div><span className="text-xs font-bold text-[var(--color-text-muted)]">{packedItems}/{totalItems}</span></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{prepQuery.data?.items?.map((entry) => <button type="button" key={entry._id} onClick={() => prepToggleMutation.mutate(entry._id)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${entry.isPacked ? 'border-[var(--color-success)]/20 bg-[var(--color-success)]/10' : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)]'}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${entry.isPacked ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white' : 'border-[var(--color-border)]'}`}>{entry.isPacked ? '✓' : ''}</span><span className={`text-sm ${entry.isPacked ? 'text-[var(--color-text-muted)] line-through' : 'font-semibold text-[var(--color-text-primary)]'}`}>{entry.item}</span><span className="ml-auto text-[10px] text-[var(--color-text-muted)]">{entry.category}</span></button>)}</div>{!prepQuery.data?.items?.length && <p className="mt-6 rounded-2xl border border-dashed border-[var(--color-border)] px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">Generate your checklist to see what this trip calls for.</p>}</Panel></div>}

          {activeTab === 'ai' && <Panel className="mx-auto max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-coral)]">Grounded travel assistant</p><h2 className="mt-2 font-display text-4xl text-[var(--color-text-primary)]">Ask about this trip.</h2><p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">Answers use the current itinerary and budget. Suggestions are labeled; live prices and availability are never invented.</p><form onSubmit={askAi} className="mt-7 flex flex-col gap-3 sm:flex-row"><input value={aiQuestion} onChange={(event) => setAiQuestion(event.target.value)} maxLength={1000} placeholder="How can we make day two less rushed?" className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-sm text-[var(--color-text-primary)]" /><button className="rounded-xl bg-[var(--color-coral)] px-6 py-3 text-sm font-bold text-white">Ask assistant</button></form>{aiAnswer && <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-5 text-sm leading-7 text-[var(--color-text-primary)]">{aiAnswer}</div>}</Panel>}

          {activeTab === 'members' && <Panel><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--color-accent)]">Your people</p><h2 className="mt-2 font-display text-3xl text-[var(--color-text-primary)]">Confirmed travelers</h2></div><span className="text-sm text-[var(--color-text-muted)]">{members.length}/{trip.maxMembers}</span></div><div className="mt-6 grid gap-3 md:grid-cols-2">{members.map((member) => <div key={member._id} className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent-soft)] font-display text-xl text-[var(--color-accent)]">{member.user?.name?.[0]?.toUpperCase() || '?'}</div><div><p className="text-sm font-bold text-[var(--color-text-primary)]">{member.user?.name}</p><p className="mt-1 text-xs text-[var(--color-text-muted)]">{member.user?.profile?.city || 'Traveler'} · {member.role === 'TRIP_ADMIN' ? 'Host' : 'Member'}</p></div></div>)}</div></Panel>}
        </main>
      </div>
    </PageTransition>
  );
};

export default TripWorkspace;
