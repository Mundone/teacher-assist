const LessonType = require('../models/lessonAssessment');

const getAllLessonAssessments = async () => {
  return await LessonType.findAll();
};

module.exports = {
  getAllLessonAssessments,
};
