import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import FocusTopicRow from '../components/FocusTopicRow';
import ReminderStatus from '../components/ReminderStatus';

const STATUS_OPTIONS = ['applied', 'oa', 'interview', 'offer', 'rejected'];

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    api
      .get(`/applications/${id}`)
      .then(({ data }) => setApplication(data))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleStatusChange(e) {
    const status = e.target.value;
    const { data } = await api.patch(`/applications/${id}/status`, { status });
    setApplication((app) => ({ ...app, status: data.status }));
  }

  async function handleGenerateTopics() {
    setIsGenerating(true);
    try {
      const { data: topics } = await api.post(`/applications/${id}/focus-topics`);
      setApplication((app) => ({ ...app, topics }));
      toast.success('Focus topics generated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not generate topics');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete your application to ${application.company}? This can't be undone.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/applications/${id}`);
      toast.success('Application deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete application');
    }
  }

  function handleTopicUpdated(updatedTopic) {
    setApplication((app) => ({
      ...app,
      topics: app.topics.map((t) => (t._id === updatedTopic._id ? updatedTopic : t)),
    }));
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-slate-400">Loading…</div>;
  }

  if (!application) {
    return <div className="flex h-screen items-center justify-center text-slate-400">Application not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
            <ArrowLeft size={16} /> Back to applications
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 font-display">{application.company}</h1>
            <p className="text-sm text-slate-500">{application.role}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={application.status} />
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Stipend / salary</p>
            <p className="text-sm text-slate-700">{application.stipend || 'Not specified'}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Status</p>
            <select
              value={application.status}
              onChange={handleStatusChange}
              className="w-full border-none bg-transparent text-sm text-slate-700 focus:outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <ReminderStatus application={application} />
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-2 text-sm font-medium text-slate-900">Job description</p>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {application.jobDescription}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-900">Focus topics</p>
            <button
              onClick={handleGenerateTopics}
              disabled={isGenerating}
              className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-50"
            >
              <Sparkles size={14} />
              {isGenerating ? 'Generating…' : application.topics?.length ? 'Regenerate' : 'Generate from JD'}
            </button>
          </div>

          {!application.topics?.length ? (
            <p className="text-sm text-slate-400">
              No topics yet — generate a study checklist from this job description.
            </p>
          ) : (
            <div className="space-y-2">
              {application.topics.map((topic) => (
                <FocusTopicRow key={topic._id} topic={topic} onUpdated={handleTopicUpdated} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}