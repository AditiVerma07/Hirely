import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LogOut, Briefcase, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, LabelList } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import NewApplicationForm from '../components/NewApplicationForm';

const STATUS_META = {
  offer: { label: 'Offer', dot: '#059669' },
  interview: { label: 'Interviewing', dot: '#D97706' },
  oa: { label: 'OA / Test', dot: '#2563EB' },
  applied: { label: 'Applied', dot: '#6B7280' },
  rejected: { label: 'Rejected', dot: '#DC2626' },
};

function StatsSection({ applications, statusFilter, onFilterChange }) {
  const counts = useMemo(() => {
    const base = {};
    Object.keys(STATUS_META).forEach((key) => (base[key] = 0));
    applications.forEach((a) => {
      const key = a.status?.toLowerCase();
      if (key in base) base[key] += 1;
    });
    return Object.entries(base)
      .map(([key, value]) => ({ key, name: STATUS_META[key].label, value, fill: STATUS_META[key].dot }))
      .filter((c) => c.value > 0);
  }, [applications]);

  const total = applications.length;
  const offerCount = applications.filter((a) => a.status?.toLowerCase() === 'offer').length;
  const offerRate = total ? Math.round((offerCount / total) * 100) : 0;

  if (total === 0 || counts.length === 0) return null;

  return (
    <div className="mb-6 grid grid-cols-3 gap-4">
      <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Applications by status</h2>
          <span className="text-xs text-slate-400">
            {statusFilter ? 'click a bar to change filter' : 'click a bar to filter'}
          </span>
        </div>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer>
            <BarChart data={counts} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                interval={0}
              />
              <YAxis hide allowDecimals={false} />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
                cursor="pointer"
                onClick={(data) => onFilterChange(data.key === statusFilter ? null : data.key)}
              >
                {counts.map((c) => (
                  <Cell
                    key={c.key}
                    fill={c.fill}
                    opacity={!statusFilter || statusFilter === c.key ? 1 : 0.3}
                  />
                ))}
                <LabelList dataKey="value" position="top" style={{ fontSize: 12, fill: '#0f172a', fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => onFilterChange(null)}
          className="flex flex-1 flex-col justify-center rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-violet-300"
        >
          <div className="mb-1 flex items-center gap-2 text-slate-400">
            <Briefcase size={14} />
            <span className="text-xs tracking-wide">TOTAL APPLICATIONS</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{total}</span>
        </button>
        <div className="flex flex-1 flex-col justify-center rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-1 flex items-center gap-2 text-slate-400">
            <TrendingUp size={14} />
            <span className="text-xs tracking-wide">OFFER RATE</span>
          </div>
          <span className="text-2xl font-bold text-emerald-600">{offerRate}%</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const { user, logout } = useAuth();

  const visibleApplications = statusFilter
    ? applications.filter((a) => a.status?.toLowerCase() === statusFilter)
    : applications;

  useEffect(() => {
    api
      .get('/applications')
      .then(({ data }) => setApplications(data))
      .finally(() => setIsLoading(false));
  }, []);

  function handleCreated(newApp) {
    setApplications((prev) => [newApp, ...prev]);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="brand-logo">Hirely</h1>
            <p className="text-sm text-slate-500">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {!isLoading && (
          <StatsSection
            applications={applications}
            statusFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        )}

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-500">
              {visibleApplications.length} application{visibleApplications.length === 1 ? '' : '(s)'}
            </p>
            {statusFilter && (
              <button
                onClick={() => setStatusFilter(null)}
                className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                {STATUS_META[statusFilter]?.label ?? statusFilter}
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            <Plus size={16} /> Add application
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <NewApplicationForm onCreated={handleCreated} onClose={() => setShowForm(false)} />
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-slate-400">Loading applications…</p>
        ) : applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-sm text-slate-500">No applications yet. Add your first one to get started.</p>
          </div>
        ) : visibleApplications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-sm text-slate-500">No applications with this status.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleApplications.map((app) => (
              <Link
                key={app._id}
                to={`/applications/${app._id}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 transition hover:border-violet-300 hover:shadow-sm"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{app.company}</p>
                  <p className="text-sm text-slate-500">{app.role}</p>
                </div>
                <div className="flex items-center gap-4">
                  {app.stipend && <span className="text-sm text-slate-500">{app.stipend}</span>}
                  <StatusBadge status={app.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}