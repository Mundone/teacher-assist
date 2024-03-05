const express = require('express');
const lessonAssessmentController = require('../controllers/lessonAssessmentController');
const paginationMiddleware = require('../middlewares/paginationMiddleware');
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

router.get('/get_lesson_assessments', paginationMiddleware, lessonAssessmentController.getLessonAssessments);

/**
 * @swagger
 * /get_lesson_assessment/{id}:
 *   get:
 *     summary: Retrieve a single lessonAssessment by ID
 *     tags: [LessonAssessment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the lessonAssessment
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonAssessment'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_lesson_assessment/:id', lessonAssessmentController.getLessonAssessmentById);


/**
 * @swagger
 * /create_lesson_assessment:
 *   post:
 *     summary: Create a new lessonAssessment
 *     tags: [LessonAssessment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonAssessment'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonAssessment'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post('/create_lesson_assessment', lessonAssessmentController.createLessonAssessment);

/**
 * @swagger
 * /update_lesson_assessment/{id}:
 *   put:
 *     tags:
 *       - LessonAssessment
 *     summary: "Update an lessonAssessment by ID"
 *     description: "This endpoint updates an existing lessonAssessment's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the lessonAssessment to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LessonAssessment"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LessonAssessment"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating lessonAssessment"
 *     security:
 *       - Authorization: []
 */
router.put('/update_lesson_assessment/:id', lessonAssessmentController.updateLessonAssessment);


/**
 * @swagger
 * /delete_lesson_assessment/{id}:
 *   delete:
 *     summary: Delete an lessonAssessment by its ID
 *     tags: [LessonAssessment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the lessonAssessment to delete
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the successful deletion
 *                   example: LessonAssessment was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */
router.delete('/delete_lesson_assessment/:id', lessonAssessmentController.deleteLessonAssessment);

module.exports = router;
