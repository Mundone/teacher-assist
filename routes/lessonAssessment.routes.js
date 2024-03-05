const express = require('express');
const lessonAssessmentController = require('../controllers/lessonAssessmentController');
const router = express.Router();

/**
 * @swagger
 * /get_lessonAssessments:
 *   get:
 *     summary: Retrieve all lessonAssessments
 *     tags: [LessonAssessment]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter lessonAssessments
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/lessonAssessment'
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_lessonAssessments', lessonAssessmentController.getLessonAssessments);
// other routes like POST, PUT, DELETE

module.exports = router;
