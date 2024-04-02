// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const paginationMiddleware = require("../middlewares/paginationMiddleware");
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /get_users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search term to filter users
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/get_users",
  paginationMiddleware,
  accessControl([1]),
  userController.getUsers
);

router.get(
  "/get_users",
  accessControl([1]),
  userController.getUsersWithoutBody
);

/**
 * @swagger
 * /get_user/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.get("/get_user/:id", accessControl([1]), userController.getUser);

/**
 * @swagger
 * /create_user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.post("/create_user", accessControl([1]), userController.createUser);

/**
 * @swagger
 * /update_user/{id}:
 *   put:
 *     tags: [User]
 *     summary: Update a user by ID
 *     description: Updates an existing user's information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: User data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 *     security:
 *       - Authorization: []
 */

router.put("/update_user/:id", accessControl([1]), userController.updateUser);

/**
 * @swagger
 * /delete_user/{id}:
 *   delete:
 *     summary: Delete a user by its ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

router.delete(
  "/delete_user/:id",
  accessControl([1]),
  userController.deleteUser
);

router.post(
  "/create_users_bulk",
  upload.single("file"),
  accessControl([1]),
  userController.createUsersBulkController
);

module.exports = router;
