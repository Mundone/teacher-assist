// routes/attendanceRecordRoutes.js
const express = require('express');
const router = express.Router();
const attendanceRecordController = require('../controllers/attendanceRecordController');



/**
 * @swagger
 * /create_attendance_record:
 *   post:
 *     summary: Create a new attendanceRecord
 *     tags: [AttendanceRecord]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceRecord'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceRecord'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.get('/get_attendance_records', attendanceRecordController.getAttendanceRecords);

/**
 * @swagger
 * /get_attendance_record/{id}:
 *   get:
 *     summary: Retrieve a single attendanceRecord by ID
 *     tags: [AttendanceRecord]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the attendanceRecord
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceRecord'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get('/get_attendance_record/:id', attendanceRecordController.getAttendanceRecord);


/**
 * @swagger
 * /create_attendance_record:
 *   post:
 *     summary: Create a new attendanceRecord
 *     tags: [AttendanceRecord]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceRecord'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceRecord'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post('/create_attendance_record', attendanceRecordController.createAttendanceRecord);


/**
 * @swagger
 * /update_attendance_record/{id}:
 *   put:
 *     tags:
 *       - AttendanceRecord
 *     summary: "Update an attendanceRecord by ID"
 *     description: "This endpoint updates an existing attendanceRecord's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the attendanceRecord to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AttendanceRecord"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AttendanceRecord"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating attendanceRecord"
 *     security:
 *       - Authorization: []
 */

router.put('/update_attendance_record/:id', attendanceRecordController.updateAttendanceRecord);


/**
 * @swagger
 * /delete_attendance_record/{id}:
 *   delete:
 *     summary: Delete an attendanceRecord by its ID
 *     tags: [AttendanceRecord]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the attendanceRecord to delete
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
 *                   example: AttendanceRecord was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete('/delete_attendance_record/:id', attendanceRecordController.deleteAttendanceRecord);

module.exports = router;
