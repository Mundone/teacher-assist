// subjectRoutes.js
const express = require("express");
const surveyController = require("../controllers/surveyController");
const { accessControl } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get(
  "/get_surveys",
  accessControl([1, 2]),
  surveyController.getSurveysController
);

router.post(
  "/create_survey",
  accessControl([1, 2]),
  surveyController.createSurveyController
);

router.post(
  "/sumbit_survey",
  surveyController.submitSurveyController
);

module.exports = router;
