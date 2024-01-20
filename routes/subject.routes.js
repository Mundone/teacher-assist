const express = require('express');
const subjectController = require('../controllers/subjectController');
const router = express.Router();

router.get('/get_subjects', subjectController.getSubjects);
// other routes like POST, PUT, DELETE

module.exports = router;
