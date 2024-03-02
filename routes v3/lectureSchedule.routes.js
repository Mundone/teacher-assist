const express = require('express');
const lectureScheduleController = require('../controllers/lectureScheduleController');
const router = express.Router();

/**
 * @swagger
 * /get_lab_schedules:
 *   get:
 *     summary: Retrieve all labSchedules
 *     tags: [LabSchedule]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter labSchedules
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LabSchedule'
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_lecture_schedules', lectureScheduleController.getLectureSchedules);
// other routes like POST, PUT, DELETE

module.exports = router;
