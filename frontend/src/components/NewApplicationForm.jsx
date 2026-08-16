import { useState } from 'react';
import { toast } from 'sonner';
import { Wand2, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function NewApplicationForm({ onCreated, onClose }) {
  const [form, setForm] = useState({ company: '', role: '', stipend: '', jobDescription: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [showPasteBox, setShowPasteBox] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleParse() {
    if (pasteText.trim().length < 20) {
      toast.error('Paste a bit more text to extract details from');
      return;
    }

    setIsParsing(true);
    try {
      const { data } = await api.post('/applications/parse', { text: pasteText });
      // Only fill fields the parser actually found something for — don't
      // stomp over anything the user may have already typed manually
      setForm((f) => ({
        company: data.company || f.company,
        role: data.role || f.role,
        stipend: data.stipend || f.stipend,
        jobDescription: data.jobDescription || f.jobDescription,
      }));
      setShowPasteBox(false);
      toast.success('Fields filled in — review before saving');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not parse that text');
    } finally {
      setIsParsing(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await api.post('/applications', form);
      toast.success(`${form.company} added`);
      onCreated(data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add application');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Add application</h2>
        <button
          type="button"
          onClick={() => setShowPasteBox((s) => !s)}
          className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100"
        >
          <Wand2 size={14} /> Paste from LinkedIn / email
        </button>
      </div>

      {showPasteBox && (
        <div className="mb-5 rounded-lg border border-violet-200 bg-violet-50/50 p-4">
          <p className="mb-2 text-xs text-slate-500">
            Paste a LinkedIn posting, an application confirmation email, or any job listing text —
            we'll fill in the fields below automatically.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={5}
            placeholder="Paste anything here…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          <button
            type="button"
            onClick={handleParse}
            disabled={isParsing}
            className="mt-2 flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {isParsing ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
            {isParsing ? 'Extracting…' : 'Auto-fill fields'}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company</label>
            <input
              value={form.company}
              onChange={update('company')}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <input
              value={form.role}
              onChange={update('role')}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">Stipend / salary</label>
          <input
            value={form.stipend}
            onChange={update('stipend')}
            placeholder="e.g. 12 LPA"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-slate-700">Job description</label>
          <textarea
            value={form.jobDescription}
            onChange={update('jobDescription')}
            required
            rows={6}
            placeholder="Paste the full job description here"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding…' : 'Add application'}
          </button>
        </div>
      </form>
    </div>
  );
}