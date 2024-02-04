const express = require('express');
const scoreController = require('../controllers/scoreController');
const paginationMiddleware = require('./paginationMiddleware');
const router = express.Router();


/**
 * @swagger
 * /get_scores:
 *   get:
 *     summary: Retrieve all scores
 *     tags: [Score]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter scores
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Score'
 *       500:
 *         description: Internal Server Error
 */

router.get('/scores', paginationMiddleware, scoreController.getScores); // Get scores for a specific week and subject



/**
 * @swagger
 * /get_score/{id}:
 *   get:
 *     summary: Retrieve a single score by ID
 *     tags: [Score]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the score
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Score'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.put('/scores/:id', paginationMiddleware, scoreController.updateScore); // Update a specific score

module.exports = router;
