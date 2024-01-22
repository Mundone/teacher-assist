const express = require('express');
const scoreController = require('../controllers/scoreController');
const paginationMiddleware = require('./paginationMiddleware');
const router = express.Router();

router.get('/scores', paginationMiddleware, scoreController.getScores); // Get scores for a specific week and subject
router.put('/scores/:scoreId', paginationMiddleware, scoreController.updateScore); // Update a specific score

module.exports = router;
