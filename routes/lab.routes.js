const express = require('express');
const labController = require('../controllers/labController');
const router = express.Router();

/**
 * @swagger
 * /get_labs:
 *   get:
 *     summary: Retrieve all labs
 *     tags: [Lab]
 *     parameters:
 *     - in: query
 *       name: search
 *       schema:
 *         type: string
 *       description: Optional search term to filter labs
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lab'
 *       500:
 *         description: Internal Server Error
 */


router.get('/get_labs', labController.getLabs);
// other routes like POST, PUT, DELETE

module.exports = router;
