const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth'); // reuse from Planify
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateStatus,
  deleteApplication,
  generateFocusTopics,
  parseJobDetails,
} = require('../controllers/applicationController');

router.use(requireAuth);

router.post('/', createApplication);
router.post('/parse', parseJobDetails);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteApplication);
router.post('/:id/focus-topics', generateFocusTopics);

module.exports = router;