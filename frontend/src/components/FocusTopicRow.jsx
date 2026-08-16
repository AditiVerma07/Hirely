import { useState } from 'react';
import { ExternalLink, Search, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/axios';

const CONFIDENCE_STYLES = {
  weak: 'bg-rose-50 text-rose-700 border-rose-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  strong: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const NEXT_CONFIDENCE = { weak: 'medium', medium: 'strong', strong: 'weak' };

export default function FocusTopicRow({ topic, onUpdated }) {
  const [isFetching, setIsFetching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualUrl, setManualUrl] = useState('');

  async function cycleConfidence() {
    const nextConfidence = NEXT_CONFIDENCE[topic.confidence];
    const { data } = await api.patch(`/focus-topics/${topic._id}`, { confidence: nextConfidence });
    onUpdated(data);
  }

  async function handleFetchResources() {
    setIsFetching(true);
    try {
      const { data } = await api.post(`/focus-topics/${topic._id}/resources/fetch`);
      onUpdated(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not fetch resources');
    } finally {
      setIsFetching(false);
    }
  }

  async function handleAddManual(e) {
    e.preventDefault();
    if (!manualTitle.trim() || !manualUrl.trim()) return;

    try {
      const { data } = await api.post(`/focus-topics/${topic._id}/resources`, {
        title: manualTitle,
        url: manualUrl,
      });
      onUpdated(data);
      setManualTitle('');
      setManualUrl('');
      setShowAddForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add link');
    }
  }

  async function handleDelete(resourceId) {
    const { data } = await api.delete(`/focus-topics/${topic._id}/resources/${resourceId}`);
    onUpdated(data);
  }

  const links = topic.resourceLinks || [];

  return (
    <div className="rounded-lg border border-slate-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-700">{topic.title}</span>
        <button
          onClick={cycleConfidence}
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize transition ${CONFIDENCE_STYLES[topic.confidence]}`}
        >
          {topic.confidence}
        </button>
      </div>

      {links.length > 0 && (
        <ul className="mt-2 space-y-1">
          {links.map((link) => (
            <li key={link._id} className="flex items-center justify-between gap-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 truncate text-xs text-violet-600 hover:text-violet-700 hover:underline"
              >
                <ExternalLink size={11} className="shrink-0" />
                <span className="truncate">{link.title}</span>
                {link.source === 'manual' && (
                  <span className="shrink-0 rounded bg-violet-50 px-1.5 py-0.5 text-[10px] text-violet-600">
                    saved
                  </span>
                )}
              </a>
              <button
                onClick={() => handleDelete(link._id)}
                className="shrink-0 text-slate-300 hover:text-rose-500"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={handleFetchResources}
          disabled={isFetching}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-600 disabled:opacity-50"
        >
          {isFetching ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
          {isFetching ? 'Searching…' : links.some((l) => l.source === 'auto') ? 'Refresh results' : 'Find resources'}
        </button>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-600"
        >
          <Plus size={12} /> Save your own link
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddManual} className="mt-2 flex gap-2">
          <input
            value={manualTitle}
            onChange={(e) => setManualTitle(e.target.value)}
            placeholder="Title"
            className="w-1/3 rounded border border-slate-200 px-2 py-1 text-xs focus:border-violet-500 focus:outline-none"
          />
          <input
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://…"
            className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-violet-500 focus:outline-none"
          />
          <button type="submit" className="rounded bg-violet-600 px-2 py-1 text-xs text-white hover:bg-violet-700">
            Save
          </button>
        </form>
      )}
    </div>
  );
}