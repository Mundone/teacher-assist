// subjectRoutes.js
const express = require("express");
const subjectScheduleController = require("../controllers/subjectScheduleController");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /get_subject_schedules:
 *   get:
 *     summary: Retrieve all subjectSchedule
 *     tags: [SubjectSchedule]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter subjectSchedule
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubjectSchedule'
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/get_subject_schedules",
  accessControl([1, 2, 3]),
  paginationMiddleware,
  subjectScheduleController.getSubjectSchedules
);

router.get(
  "/get_subject_schedules",
  accessControl([1, 2, 3]),
  paginationMiddleware,
  subjectScheduleController.getSubjectSchedulesWithoutBody
);

/**
 * @swagger
 * /get_subject_schedule/{id}:
 *   get:
 *     summary: Retrieve a single subjectSchedule by ID
 *     tags: [SubjectSchedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the subjectSchedule
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectSchedule'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get(
  "/get_subject_schedule/:id",
  subjectScheduleController.getSubjectSchedule
);

/**
 * @swagger
 * /create_subject_schedule:
 *   post:
 *     summary: Create a new subjectSchedule
 *     tags: [SubjectSchedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubjectSchedule'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectSchedule'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post(
  "/create_subject_schedule",
  subjectScheduleController.createSubjectSchedule
);

/**
 * @swagger
 * /update_subject_schedule/{id}:
 *   put:
 *     tags:
 *       - SubjectSchedule
 *     summary: "Update an subjectSchedule by ID"
 *     description: "This endpoint updates an existing subjectSchedule's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the subjectSchedule to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SubjectSchedule"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SubjectSchedule"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating subjectSchedule"
 *     security:
 *       - Authorization: []
 */

router.put(
  "/update_subject_schedule/:id",
  subjectScheduleController.updateSubjectSchedule
);

/**
 * @swagger
 * /delete_subject_schedule/{id}:
 *   delete:
 *     summary: Delete an subjectSchedule by its ID
 *     tags: [SubjectSchedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subjectSchedule to delete
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
 *                   example: SubjectSchedule was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete(
  "/delete_subject_schedule/:id",
  subjectScheduleController.deleteSubjectSchedule
);

module.exports = router;
