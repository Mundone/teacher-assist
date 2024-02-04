const express = require('express');
const teacherRoleController = require('../controllers/teacherRoleController');
const router = express.Router();

/**
 * @swagger
 * /get_teacher_roles:
 *   get:
 *     summary: Retrieve all teacherRoles
 *     tags: [TeacherRole]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter teacherRoles
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeacherRole'
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_teacher_roles', teacherRoleController.getTeacherRoles);
// other routes like POST, PUT, DELETE

module.exports = router;
