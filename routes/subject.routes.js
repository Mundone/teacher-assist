// subjectRoutes.js
const express = require("express");
const subjectController = require("../controllers/subjectController");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /get_subjects:
 *   get:
 *     summary: Retrieve all subject
 *     tags: [Subject]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter subject
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/get_subjects",
  paginationMiddleware,
  accessControl([1, 2, 3]),
  subjectController.getSubjects
);

router.get(
  "/get_subjects",
  accessControl([1, 2, 3]),
  subjectController.getSubjectWithoutBody
);

/**
 * @swagger
 * /get_subject/{id}:
 *   get:
 *     summary: Retrieve a single subject by ID
 *     tags: [Subject]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the subject
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get(
  "/get_subject/:id",
  accessControl([1, 2, 3]),
  subjectController.getSubject
);

/**
 * @swagger
 * /create_subject:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subject]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post(
  "/create_subject",
  accessControl([1, 2, 3]),
  subjectController.createSubject
);

/**
 * @swagger
 * /update_subject/{id}:
 *   put:
 *     tags:
 *       - Subject
 *     summary: "Update an subject by ID"
 *     description: "This endpoint updates an existing subject's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the subject to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Subject"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Subject"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating subject"
 *     security:
 *       - Authorization: []
 */

router.put(
  "/update_subject/:id",
  accessControl([1, 2, 3]),
  subjectController.updateSubject
);

/**
 * @swagger
 * /delete_subject/{id}:
 *   delete:
 *     summary: Delete an subject by its ID
 *     tags: [Subject]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subject to delete
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
 *                   example: Subject was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete(
  "/delete_subject/:id",
  accessControl([1, 2, 3]),
  subjectController.deleteSubject
);

router.put(
  "/start_subject/:id",
  accessControl([1, 2, 3]),
  subjectController.startSubjectController
);

module.exports = router;
