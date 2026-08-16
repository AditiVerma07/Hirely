const cron = require('node-cron');
const Application = require('../models/Application');
const FocusTopic = require('../models/FocusTopic');
const { sendFollowUpReminder, sendInterviewPrepReminder } = require('../services/emailService');

const FOLLOW_UP_AFTER_DAYS = 7;
const INTERVIEW_PREP_WINDOW_DAYS = 3;

async function runFollowUpCheck() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - FOLLOW_UP_AFTER_DAYS);

  // "applied" status, applied before the cutoff, and no reminder sent yet — each
  // condition matters: without followUpReminderSentAt: null this would re-fire daily
  const stale = await Application.find({
    status: 'applied',
    applicationDate: { $lte: cutoff },
    followUpReminderSentAt: null,
  }).populate('user', 'name email');

  for (const app of stale) {
    const daysSinceApplied = Math.floor((Date.now() - app.applicationDate) / (1000 * 60 * 60 * 24));

    try {
      await sendFollowUpReminder({
        to: app.user.email,
        name: app.user.name,
        company: app.company,
        role: app.role,
        daysSinceApplied,
      });
      app.followUpReminderSentAt = new Date();
      await app.save();
    } catch (err) {
      // One failed email shouldn't stop the rest of the batch from sending
      console.error(`Follow-up reminder failed for application ${app._id}:`, err.message);
    }
  }
}

async function runInterviewPrepCheck() {
  const windowStart = new Date();
  const windowEnd = new Date();
  windowEnd.setDate(windowEnd.getDate() + INTERVIEW_PREP_WINDOW_DAYS);

  const upcoming = await Application.find({
    status: 'interview',
    interviewDate: { $gte: windowStart, $lte: windowEnd },
    interviewReminderSentAt: null,
  }).populate('user', 'name email');

  for (const app of upcoming) {
    const daysUntilInterview = Math.ceil((app.interviewDate - Date.now()) / (1000 * 60 * 60 * 24));

    const weakTopics = await FocusTopic.find({
      applications: app._id,
      confidence: 'weak',
    }).select('title');

    try {
      await sendInterviewPrepReminder({
        to: app.user.email,
        name: app.user.name,
        company: app.company,
        role: app.role,
        daysUntilInterview,
        weakTopics: weakTopics.map((t) => t.title),
      });
      app.interviewReminderSentAt = new Date();
      await app.save();
    } catch (err) {
      console.error(`Interview prep reminder failed for application ${app._id}:`, err.message);
    }
  }
}

// Runs once a day at 8 AM server time — both checks live in one job since they
// share the same "once daily" cadence, no reason to schedule two separate crons
function startReminderCron() {
  cron.schedule('0 8 * * *', async () => {
    await runFollowUpCheck();
    await runInterviewPrepCheck();
  });
}

module.exports = { startReminderCron, runFollowUpCheck, runInterviewPrepCheck };