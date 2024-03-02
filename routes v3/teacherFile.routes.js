const express = require('express');
const teacherFileController = require('../controllers/teacherFileController');
const router = express.Router();

/**
 * @swagger
 * /get_teacher_files:
 *   get:
 *     summary: Retrieve all teacherFile
 *     tags: [TeacherFile]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter teacherFile
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeacherFile'
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_teacher_files', teacherFileController.getTeacherFiles);
// other routes like POST, PUT, DELETE

module.exports = router;
