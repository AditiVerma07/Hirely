import { Mail, MailCheck } from 'lucide-react';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ReminderStatus({ application }) {
  const showFollowUp = application.status === 'applied';
  const showInterview = application.status === 'interview' && application.interviewDate;

  if (!showFollowUp && !showInterview) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Reminders</p>

      <div className="space-y-2">
        {showFollowUp && (
          <ReminderLine
            label="Follow-up nudge"
            sentAt={application.followUpReminderSentAt}
            pendingText="Sends automatically 7 days after applying if status hasn't changed"
          />
        )}

        {showInterview && (
          <ReminderLine
            label="Interview prep email"
            sentAt={application.interviewReminderSentAt}
            pendingText="Sends automatically 3 days before your interview date"
          />
        )}
      </div>
    </div>
  );
}

function ReminderLine({ label, sentAt, pendingText }) {
  return (
    <div className="flex items-start gap-2">
      {sentAt ? (
        <MailCheck size={14} className="mt-0.5 shrink-0 text-emerald-600" />
      ) : (
        <Mail size={14} className="mt-0.5 shrink-0 text-slate-300" />
      )}
      <div>
        <p className="text-sm text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">
          {sentAt ? `Sent on ${formatDate(sentAt)}` : pendingText}
        </p>
      </div>
    </div>
  );
}