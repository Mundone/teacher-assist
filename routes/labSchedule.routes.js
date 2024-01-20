const express = require('express');
const labScheduleController = require('../controllers/labScheduleController');
const router = express.Router();

router.get('/get_lab_schedules', labScheduleController.getLabSchedules);
// other routes like POST, PUT, DELETE

module.exports = router;
