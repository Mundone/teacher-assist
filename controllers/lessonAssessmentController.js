const LessonAssessmentService = require('../services/lessonAssessmentService');

const getLessonAssessments = async (req, res, next) => {
  try {
    const lessonAssessments = await LessonAssessmentService.getAllLessonAssessments();
    res.json(lessonAssessments);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getLessonAssessments
};