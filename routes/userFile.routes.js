const express = require('express');
const userFileController = require('../controllers/userFileController');
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

router.get('/get_user_files', userFileController.getUserFiles);
// other routes like POST, PUT, DELETE

module.exports = router;
