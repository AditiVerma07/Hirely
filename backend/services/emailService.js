const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendFollowUpReminder({ to, name, company, role, daysSinceApplied }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Follow up on your ${role} application at ${company}?`,
    text: `Hi ${name},\n\nIt's been ${daysSinceApplied} days since you applied to ${role} at ${company} with no status update. Worth sending a follow-up?\n\n— Job Tracker`,
  });
}

async function sendInterviewPrepReminder({ to, name, company, role, daysUntilInterview, weakTopics }) {
  const topicList = weakTopics.length
    ? weakTopics.map((t) => `- ${t}`).join('\n')
    : '- No weak topics logged yet for this company';

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `${company} interview in ${daysUntilInterview} day(s) — your focus list`,
    text: `Hi ${name},\n\nYour ${role} interview at ${company} is in ${daysUntilInterview} day(s). Here's what you flagged as weak:\n\n${topicList}\n\n— Job Tracker`,
  });
}

module.exports = { sendFollowUpReminder, sendInterviewPrepReminder };