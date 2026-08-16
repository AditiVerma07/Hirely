const FocusTopic = require('../models/FocusTopic');
const { fetchTopicResources } = require('../services/searchService');

async function updateConfidence(req, res) {
  try {
    const { confidence } = req.body;

    if (!['weak', 'medium', 'strong'].includes(confidence)) {
      return res.status(400).json({ message: 'confidence must be weak, medium, or strong' });
    }

    const topic = await FocusTopic.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { confidence },
      { new: true }
    );

    if (!topic) return res.status(404).json({ message: 'Focus topic not found' });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: 'Could not update confidence', error: err.message });
  }
}

/**
 * Calls a real search API and saves the top results as resourceLinks tagged
 * "auto". Re-running this replaces the previous auto set (not the manual
 * ones), so clicking "Find resources" again gives a fresh batch instead of
 * piling up duplicates.
 */
async function fetchResources(req, res) {
  try {
    const topic = await FocusTopic.findOne({ _id: req.params.id, user: req.user.id });
    if (!topic) return res.status(404).json({ message: 'Focus topic not found' });

    const results = await fetchTopicResources(topic.title);
    const autoLinks = results.map((r) => ({ ...r, source: 'auto' }));
    const manualLinks = topic.resourceLinks.filter((link) => link.source === 'manual');

    topic.resourceLinks = [...manualLinks, ...autoLinks];
    await topic.save();

    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch resources', error: err.message });
  }
}

// Lets the user pin a link they personally trust — kept separate from the
// auto-fetched set so re-fetching never wipes out something they chose deliberately.
async function addManualResource(req, res) {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'title and url are required' });
    }

    const topic = await FocusTopic.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $push: { resourceLinks: { title, url, source: 'manual' } } },
      { new: true }
    );

    if (!topic) return res.status(404).json({ message: 'Focus topic not found' });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: 'Could not add resource', error: err.message });
  }
}

async function deleteResource(req, res) {
  try {
    const topic = await FocusTopic.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $pull: { resourceLinks: { _id: req.params.resourceId } } },
      { new: true }
    );

    if (!topic) return res.status(404).json({ message: 'Focus topic not found' });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: 'Could not remove resource', error: err.message });
  }
}

module.exports = { updateConfidence, fetchResources, addManualResource, deleteResource };