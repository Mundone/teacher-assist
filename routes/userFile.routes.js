const express = require("express");
const userFileController = require("../controllers/userFileController");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /get_user_files:
 *   get:
 *     summary: Retrieve all userFile
 *     tags: [UserFile]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter userFile
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserFile'
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/get_user_files",
  paginationMiddleware,
  accessControl([1, 2, 3]),
  userFileController.getUserFilesController
);
router.get(
  "/get_user_file/:id",
  accessControl([1, 2, 3]),
  userFileController.getUserFileController
);
router.post(
  "/create_user_file",
  accessControl([1, 2, 3]),
  userFileController.createUserFileController
);
router.put(
  "/update_user_file/:id",
  accessControl([1, 2, 3]),
  userFileController.updateUserFileController
);

router.delete(
  "/delete_user_file/:id",
  accessControl([1, 2, 3]),
  userFileController.deleteUserFileController
);

module.exports = router;
