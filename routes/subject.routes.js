// subjectRoutes.js
const express = require('express');
const subjectController = require('../controllers/subjectController');
const paginationMiddleware = require('./paginationMiddleware'); // Ensure correct path
const router = express.Router();

router.get('/subjects', paginationMiddleware, subjectController.getSubjects);
router.post('/subjects', subjectController.createSubject);
router.put('/subjects/:id', subjectController.updateSubject);
router.get('/subjects/:id', subjectController.getSubject);
router.delete('/subjects/:id', subjectController.deleteSubject);

module.exports = router;
