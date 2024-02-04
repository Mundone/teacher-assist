// routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

/**
 * @swagger
 * /get_teachers:
 *   get:
 *     summary: Retrieve all teachers
 *     tags: [Teacher]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search term to filter teachers
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_teachers', teacherController.getTeachers);

/**
 * @swagger
 * /get_teacher/{id}:
 *   get:
 *     summary: Retrieve a single teacher by ID
 *     tags: [Teacher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the teacher
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_teacher/:id', teacherController.getTeacher);

/**
 * @swagger
 * /create_teacher:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teacher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post('/create_teacher', teacherController.createTeacher);

/**
 * @swagger
 * /update_teacher/{id}:
 *   put:
 *     tags: [Teacher]
 *     summary: Update a teacher by ID
 *     description: Updates an existing teacher's information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Teacher data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Error updating teacher
 *     security:
 *       - Authorization: []
 */

router.put('/update_teacher/:id', teacherController.updateTeacher);

/**
 * @swagger
 * /delete_teacher/{id}:
 *   delete:
 *     summary: Delete a teacher by its ID
 *     tags: [Teacher]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the teacher to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete('/delete_teacher/:id', teacherController.deleteTeacher);

module.exports = router;
