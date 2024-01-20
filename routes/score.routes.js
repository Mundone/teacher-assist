const express = require('express');
const scoreController = require('../controllers/scoreController');
const router = express.Router();

router.get('/get_scores', scoreController.getScores);
// other routes like POST, PUT, DELETE

module.exports = router;
