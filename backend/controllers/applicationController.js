const Application = require('../models/Application');
const FocusTopic = require('../models/FocusTopic');
const { extractFocusTopics, extractApplicationDetails } = require('../services/llmService');

async function deleteApplication(req, res) {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) return res.status(404).json({ message: 'Application not found' });

    await FocusTopic.updateMany(
      { applications: application._id },
      { $pull: { applications: application._id } }
    );

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Could not delete application', error: err.message });
  }
}

// Parses raw pasted text (LinkedIn posting, email, anything) into structured
// fields WITHOUT saving anything — the frontend uses this to pre-fill the
// add-application form, and the user still reviews/edits before submitting.
async function parseJobDetails(req, res) {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 20) {
      return res.status(400).json({ message: 'Paste more text to extract details from' });
    }

    const details = await extractApplicationDetails(text);
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: 'Could not parse job details', error: err.message });
  }
}

async function createApplication(req, res) {
  try {
    const { company, role, jobDescription, stipend, applicationDate, interviewDate, notes } = req.body;

    if (!company || !role || !jobDescription) {
      return res.status(400).json({ message: 'company, role, and jobDescription are required' });
    }

    const application = await Application.create({
      user: req.user.id,
      company,
      role,
      jobDescription,
      stipend,
      applicationDate,
      interviewDate,
      notes,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Could not create application', error: err.message });
  }
}

async function getApplications(req, res) {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({ applicationDate: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch applications', error: err.message });
  }
}

async function getApplicationById(req, res) {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user.id });
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const topics = await FocusTopic.find({ applications: application._id }).sort({ confidence: 1 });
    res.json({ ...application.toObject(), topics });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch application', error: err.message });
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    );

    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Could not update status', error: err.message });
  }
}

/**
 * Core new feature: reads the application's stored JD, asks the LLM for
 * focus topics, then upserts each topic — linking to this application
 * instead of duplicating if the topic (e.g. "System design") already
 * exists for this user from a different company.
 */
async function generateFocusTopics(req, res) {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user.id });
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const topicTitles = await extractFocusTopics(application.jobDescription);

    const topics = await Promise.all(
      topicTitles.map((title) =>
        FocusTopic.findOneAndUpdate(
          { user: req.user.id, title },
          {
            $setOnInsert: { source: 'ai-suggested', confidence: 'weak' },
            $addToSet: { applications: application._id },
          },
          { upsert: true, new: true }
        )
      )
    );

    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: 'Could not generate focus topics', error: err.message });
  }
}

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateStatus,
  deleteApplication,
  generateFocusTopics,
  parseJobDetails,
};