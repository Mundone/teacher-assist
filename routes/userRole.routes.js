const express = require('express');
const userRoleController = require('../controllers/userRoleController');
const router = express.Router();
const paginationMiddleware = require('../middlewares/paginationMiddleware');

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

router.post('/get_user_roles', paginationMiddleware, userRoleController.getUserRoles);
// other routes like POST, PUT, DELETE

module.exports = router;
