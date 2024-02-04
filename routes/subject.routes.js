// subjectRoutes.js
const express = require('express');
const subjectController = require('../controllers/subjectController');
const paginationMiddleware = require('./paginationMiddleware'); // Ensure correct path
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

router.get('/get_subjects', paginationMiddleware, subjectController.getSubjects);

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

router.get('/get_subject/:id', subjectController.getSubject);

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

router.post('/create_subject', subjectController.createSubject);


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

router.put('/update_subject/:id', subjectController.updateSubject);

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

router.delete('/delete_subject/:id', subjectController.deleteSubject);

module.exports = router;
