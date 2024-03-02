// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

/**
 * @swagger
 * /get_assignments:
 *   get:
 *     summary: Retrieve all assignment
 *     tags: [Assignment]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter assignment
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_assignments', assignmentController.getAssignments);


/**
 * @swagger
 * /get_assignment/{id}:
 *   get:
 *     summary: Retrieve a single assignment by ID
 *     tags: [Assignment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the assignment
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_assignment/:id', assignmentController.getAssignment);


/**
 * @swagger
 * /create_assignment:
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post('/create_assignment', assignmentController.createAssignment);


/**
 * @swagger
 * /update_assignment/{id}:
 *   put:
 *     tags:
 *       - Assignment
 *     summary: "Update an assignment by ID"
 *     description: "This endpoint updates an existing assignment's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the assignment to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Assignment"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Assignment"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating assignment"
 *     security:
 *       - Authorization: []
 */

router.put('/update_assignment/:id', assignmentController.updateAssignment);


/**
 * @swagger
 * /delete_assignment/{id}:
 *   delete:
 *     summary: Delete an assignment by its ID
 *     tags: [Assignment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assignment to delete
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
 *                   example: assignment was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete('/delete_assignment/:id', assignmentController.deleteAssignment);

module.exports = router;
