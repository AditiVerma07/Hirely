const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const {
  updateConfidence,
  fetchResources,
  addManualResource,
  deleteResource,
} = require('../controllers/focusTopicController');

router.use(requireAuth);

router.patch('/:id', updateConfidence);
router.post('/:id/resources/fetch', fetchResources);
router.post('/:id/resources', addManualResource);
router.delete('/:id/resources/:resourceId', deleteResource);

module.exports = router;