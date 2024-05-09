const express = require("express");
const lessonTypeController = require("../controllers/lessonTypeController");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /get_lessonTypes:
 *   get:
 *     summary: Retrieve all lessonTypes
 *     tags: [LessonType]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter lessonTypes
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/lessonType'
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/get_lesson_types",
  accessControl([1, 2, 3]),
  paginationMiddleware,
  lessonTypeController.getLessonTypes
);

router.get(
  "/get_lesson_types",
  accessControl([1, 2, 3]),
  lessonTypeController.getLessonTypesWithoutBody
);

router.get(
  "/get_lesson_type/:id",
  accessControl([1, 2, 3]),
  lessonTypeController.getLessonTypeById
);

router.post(
  "/create_lesson_type",
  accessControl([1]),
  lessonTypeController.createLessonType
);

router.put(
  "/update_lesson_type/:id",
  accessControl([1]),
  lessonTypeController.updateLessonType
);

router.delete(
  "/delete_lesson_type/:id",
  accessControl([1]),
  lessonTypeController.deleteLessonType
);

router.get(
  "/get_lesson_types_of_subject/:subject_id",
  accessControl([1, 2, 3]),
  lessonTypeController.getLessonTypesOfSubjectController
);

module.exports = router;
