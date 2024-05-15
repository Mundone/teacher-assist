// routes/studentRoutes.js
const express = require("express");
const studentController = require("../controllers/studentController");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /get_students:
 *   get:
 *     summary: Retrieve all student
 *     tags: [Student]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter student
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/get_students/:subject_id",
  accessControl([1, 2]),
  paginationMiddleware,
  studentController.getStudentsController
);

// router.get(
//   "/get_students",
//   accessControl([1, 2]),
//   studentController.getStudentsWithoutBody
// );

/**
 * @swagger
 * /get_student/{id}:
 *   get:
 *     summary: Retrieve a single student by ID
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the student
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get(
  "/get_student/:id",
  accessControl([1, 2]),
  studentController.getStudentByIdController
);

/**
 * @swagger
 * /create_student:
 *   post:
 *     summary: Create a new student
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post(
  "/create_student",
  accessControl([1, 2]),
  studentController.createStudentController
);


router.post(
  "/create_student_bulk",
  accessControl([1, 2]),
  studentController.createStudentBulkController
);

/**
 * @swagger
 * /update_student/{id}:
 *   put:
 *     tags:
 *       - Student
 *     summary: "Update an student by ID"
 *     description: "This endpoint updates an existing student's information."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID of the student to update"
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: "data to update"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Student"
 *     responses:
 *       200:
 *         description: "updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Student"
 *       400:
 *         description: "Invalid request"
 *       404:
 *         description: "not found"
 *       500:
 *         description: "Error updating student"
 *     security:
 *       - Authorization: []
 */
router.put(
  "/update_student/:id",
  accessControl([1, 2]),
  studentController.updateStudentController
);

/**
 * @swagger
 * /delete_student/{id}:
 *   delete:
 *     summary: Delete an student by its ID
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the student to delete
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
 *                   example: Student was deleted successfully!
 *       404:
 *         description: not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */
router.delete(
  "/delete_student/:id",
  accessControl([1, 2]),
  studentController.deleteStudentController
);

module.exports = router;
