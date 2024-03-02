const express = require('express');
const lessonTypeController = require('../controllers/lessonTypeController');
const router = express.Router();

/**
 * @swagger
 * /get_lessonTypes:
 *   get:
 *     summary: Retrieve all lessonTypes
 *     tags: [LessonType]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter lessonTypes
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/lessonType'
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_lessonTypes', lessonTypeController.getLessonTypes);
// other routes like POST, PUT, DELETE

module.exports = router;
