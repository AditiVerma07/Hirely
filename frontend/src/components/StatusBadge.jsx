const STATUS_STYLES = {
  applied: 'bg-slate-100 text-slate-600',
  oa: 'bg-blue-50 text-blue-700',
  interview: 'bg-amber-50 text-amber-700',
  offer: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
};

const STATUS_LABELS = {
  applied: 'Applied',
  oa: 'Online assessment',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}