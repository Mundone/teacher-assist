// subjectRoutes.js
const express = require("express");
const surveyController = require("../controllers/surveyController");
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post(
  "/get_surveys",
  accessControl([1, 2]),
  surveyController.getSurveysController
);

module.exports = router;
