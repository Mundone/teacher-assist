const express = require('express');
const labController = require('../controllers/labController');
const router = express.Router();

router.get('/get_labs', labController.getLab);
// other routes like POST, PUT, DELETE

module.exports = router;
