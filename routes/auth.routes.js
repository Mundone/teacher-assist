const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
require('../config/passport-setup'); // adjust the path as needed

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a new account
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */


router.post('/register', authController.register);


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login by an account
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/login', authController.login);

/**
 * @swagger
 * /get_auth_info:
 *   get:
 *     summary: get_auth_info refresh token
 *     tags: [Account]
 *     responses:
 *       201:
 *         description: Returned
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *     security:
 *       - Authorization: []
 */

// Route
router.get('/get_auth_info', authController.getAuthInfo);

module.exports = router;
