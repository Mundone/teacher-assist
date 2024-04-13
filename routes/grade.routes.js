const express = require("express");
const gradeController = require("../controllers/gradeController");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /get_grades:
 *   get:
 *     summary: Retrieve all grades
 *     tags: [Grade]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter grades
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/get_grades",
  accessControl([1, 2, 3]),
  paginationMiddleware,
  gradeController.getGradesController
);

router.post(
  "/get_direct_converted_grades",
  accessControl([1, 2, 3]),
  paginationMiddleware,
  gradeController.getDirectConvertedGradesController
);

router.post(
  "/get_sd_converted_grades",
  accessControl([1, 2, 3]),
  paginationMiddleware,
  gradeController.getSDConvertedGradesController
);

/**
 * @swagger
 * /get_grade/{id}:
 *   get:
 *     summary: Retrieve a single grade by ID
 *     tags: [Grade]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the grade
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.put(
  "/update_grade/:id",
  accessControl([1, 2, 3]),
  gradeController.updateGradeController
); // Update a specific grade

module.exports = router;
