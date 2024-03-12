const express = require("express");
const userRoleController = require("../controllers/userRoleController");
const router = express.Router();
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /get_user_roles:
 *   get:
 *     summary: Retrieve all userRoles
 *     tags: [UserRole]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter userRoles
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRole'
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/get_user_roles",
  paginationMiddleware,
  userRoleController.getUserRoles
);

router.get(
  "/get_user_roles",
  accessControl([1, 2, 3]),
  userRoleController.getUserRolesWithoutBody
);

router.get(
  "/get_user_role/:id",
  accessControl([1, 2, 3]),
  userRoleController.getUserRoleById
);

router.post(
  "/create_user_role",
  accessControl([1]),
  userRoleController.createUserRole
);

router.put(
  "/update_user_role/:id",
  accessControl([1]),
  userRoleController.updateUserRole
);

router.delete(
  "/delete_user_role/:id",
  accessControl([1]),
  userRoleController.deleteUserRole
);

module.exports = router;
