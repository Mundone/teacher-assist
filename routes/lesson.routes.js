// subjectRoutes.js
const express = require("express");
const lessonController = require("../controllers/lessonController");
const paginationMiddleware = require("../middlewares/paginationMiddleware"); // Ensure correct path
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /get_lessons:
 *   get:
 *     summary: Retrieve all lesson
 *     tags: [Lesson]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter lesson
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/get_lessons/:subjectId",
  accessControl([1, 2, 3]),
  paginationMiddleware,
  lessonController.getLessons
);

router.get(
  "/get_lessons/:subjectId",
  accessControl([1, 2, 3]),
  paginationMiddleware,
  lessonController.getLessonsWithoutBody
);


// router.get(
//   "/get_lesson_assessments",
//   accessControl([1, 2, 3]),
//   lessonController.getLessons
// );

/**
 * @swagger
 * /get_lesson/{id}:
 *   get:
 *     summary: Retrieve a single lesson by ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the lesson
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get(
  "/get_lesson/:id",
  accessControl([1, 2, 3]),
  lessonController.getLessonById
);

/**
 * @swagger
 * /create_lesson:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lesson]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post(
  "/create_lesson",
  accessControl([1, 2, 3]),
  lessonController.createLesson
);

/**
 * @swagger
 * /update_lesson/{id}:
 *   put:
 *     tags:
 *       - Lesson
 *     summary: "Update an lesson by ID"
 *     description: "This endpoint updates an existing lesson's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the lesson to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Lesson"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Lesson"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating lesson"
 *     security:
 *       - Authorization: []
 */

router.put(
  "/update_lesson/:id",
  accessControl([1, 2, 3]),
  lessonController.updateLesson
);

/**
 * @swagger
 * /delete_lesson/{id}:
 *   delete:
 *     summary: Delete an lesson by its ID
 *     tags: [Lesson]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the lesson to delete
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
 *                   example: Lesson was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete(
  "/delete_lesson/:id",
  accessControl([1, 2, 3]),
  lessonController.deleteLesson
);

module.exports = router;
